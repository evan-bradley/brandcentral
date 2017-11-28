import pymysql.cursors
import hashlib
import operator
import numpy as np
import pika
from sklearn.cluster import KMeans
from sklearn.metrics import classification_report,confusion_matrix,accuracy_score
from sklearn.neural_network import MLPClassifier
from random import *
import json
from CNN import CNNUpdate

# Create a connection to the mysql database
connection = pymysql.connect(host='localhost',
                             user='root',
                             password='',
                             db='BRAND_CENTRAL',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

classification_models = {}

def calculate_product_vectors(vector_length=200):
    """
    Calculate the vectors for every product. The resulting product vectors will be
    of the specified length. This is accomplished by using feature hashing, where
    the hash function is just the id of the product. The index is calculated using
    the modulus of the product id. The coresponding entry at that index is then
    either incremented, or decremented, depending on whether the product id is an
    even or odd number.
    """
    with connection.cursor() as cursor:
        # Get the tags for all products. Only include active tags.
        sql = "SELECT PROD_TAG_ASSIGN.PRODUCT_ID as pid, PROD_TAG_ASSIGN.TAG_ID as tid FROM PROD_TAG_ASSIGN JOIN TAG ON PROD_TAG_ASSIGN.TAG_ID = TAG.TAG_ID WHERE TAG_ACTIVE = 'YES';"

        cursor.execute(sql)
        result = cursor.fetchall()

        # Convert using feature hashing the the specified length
        product_vectors = {}
        for item in result:
            if item['pid'] not in product_vectors:
                product_vectors[item['pid']] = np.zeros(vector_length)
            index = item['tid'] % vector_length
            sign = -1 if (item['tid'] % 2 == 0) else 1
            product_vectors[item['pid']][index] += sign
        return product_vectors

def calculate_user_weight_vectors(vector_length):
    """
    Calculate a weight vector, of the specified size, for each user. The weight vector
    is just the difference between the sum of the product vectors the user has liked
    and the product vectors the user has disliked.
    """
    # Compute the product vectors
    product_vectors = calculate_product_vectors(vector_length)

    with connection.cursor() as cursor:
        # Get the products that the user likes
        sql = "SELECT USER_ID as uid, PRODUCT_ID as pid FROM LIKES"
        cursor.execute(sql)
        like_results = cursor.fetchall()

        # Get the products that the user dislikes
        sql = "SELECT USER_ID as uid, PRODUCT_ID as pid FROM DISLIKES"
        cursor.execute(sql)
        dislike_result = cursor.fetchall()

        # Construct the user wights by adding liked products and subtracting disliked products
        user_weights = {}
        for item in like_results:
            if item['uid'] not in user_weights:
                user_weights[item['uid']] = np.zeros(vector_length)
            user_weights[item['uid']] = np.add(user_weights[item['uid']], product_vectors[item['pid']])

        for item in dislike_result:
            if item['uid'] not in user_weights:
                user_weights[item['uid']] = np.zeros(vector_length)
            user_weights[item['uid']] = np.subtract(user_weights[item['uid']], product_vectors[item['pid']])
        return user_weights

def calculate_all_weight_vectors(vector_length, weights):
    # Compute the product vectors
    product_vectors = calculate_product_vectors(vector_length)

    dataset = []
    for item in product_vectors:
       dataset.append(item * weights)

    return dataset

def cluster_users(number_of_clusters):
    """
    Computes the cluster means for the specified number of clusters.
    """
    # Get the user weight vectors, because we want to cluster users
    user_weights = calculate_user_weight_vectors(200)

    # Perform clustering using K Means
    user_weights_array = np.array(list(user_weights.values()))
    kmeans = KMeans(n_clusters=number_of_clusters).fit(user_weights_array)
    print("Number of Clusters:", number_of_clusters)
    print("Cluster Labels:", kmeans.labels_)
    #print("Cluster Means:", kmeans.cluster_centers_)
    return kmeans.labels_, kmeans.cluster_centers_

def data_for_uid(vector_length, uid):
    product_vectors = calculate_product_vectors(vector_length)

    with connection.cursor() as cursor:
        like_results = []
        dislike_result = []
        for user_id in uid:
            # Get the products that the user likes
            sql = "SELECT USER_ID as uid, PRODUCT_ID as pid FROM LIKES WHERE USER_ID = " + str(user_id)
            cursor.execute(sql)
            like_results += cursor.fetchall()

            # Get the products that the user dislikes
            sql = "SELECT USER_ID as uid, PRODUCT_ID as pid FROM DISLIKES WHERE USER_ID = " + str(user_id)
            cursor.execute(sql)
            dislike_result += cursor.fetchall()

        # Construct the user wights by adding liked products and subtracting disliked products
        user_weights = {}
        for item in like_results:
            if item['uid'] not in user_weights:
                user_weights[item['uid']] = np.zeros(vector_length)
            user_weights[item['uid']] = np.add(user_weights[item['uid']], product_vectors[item['pid']])

        for item in dislike_result:
            if item['uid'] not in user_weights:
                user_weights[item['uid']] = np.zeros(vector_length)
            user_weights[item['uid']] = np.subtract(user_weights[item['uid']], product_vectors[item['pid']])

        # Multiply each product by the like/dislike and add it to the dataset
        dataset = {'data':[], 'label':[]}
        for item in like_results:
            dataset['data'].append(user_weights[item['uid']] * product_vectors[item['pid']])
            dataset['label'].append(1)
        for item in dislike_result:
            dataset['data'].append(user_weights[item['uid']] * product_vectors[item['pid']])
            dataset['label'].append(0)
        return dataset

def data_train_test_for_uids(uids):
    dataset = data_for_uid(200, uids)
    X = dataset['data']
    y = dataset['label']
    return X, y

def train_models_for_clusters():
    global classification_models
    num_clusters = 0
    with connection.cursor() as cursor:
        cursor.execute("SELECT DISTINCT USER_CLUSTER_ID FROM USER")
        num_clusters = cursor.rowcount
    clustered_users, centers = cluster_users(num_clusters)
    for cluster_id in range(1, num_clusters + 1):
        # Retrieve all users in the cluster
        print("Training Cluster: " + str(cluster_id))
        users = []
        for inx in range(len(clustered_users)):
            if clustered_users[inx] == cluster_id:
                users.append(inx)

        # Train and store the model for that cluster
        model = train_model_for_users(users)
        if model != 0:
            classification_models[cluster_id] = train_model_for_users(users)

def train_model_for_users(uids):
    # Retrieve the training data and test data
    X, y = data_train_test_for_uids(uids)
    if len(X) == 0:
        return 0
    return MLPClassifier(max_iter=1000).fit(X,y)

def rabbitmq_start():
    # credentials = pika.PlainCredentials('brandcentral', 'brandcentral')
    # parameters = pika.ConnectionParameters('brandcentral.xyz', 5672, '/', credentials)
    credentials = pika.PlainCredentials('guest', 'guest')
    parameters = pika.ConnectionParameters('localhost')
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()

    # Configure the callback. Expects body to be in the form {"user_id":1}
    def on_message(channel, method, properties, body):
        body_json = json.loads(body)
        user_id = body_json['user_id']
        print(" [x] Updating user: {user_id}")
        update_user(user_id)
    channel.basic_consume(on_message, queue='user_update_queue', no_ack=True)

    # Start listening for messages
    print('[*] Waiting for messages. To exit press CTRL+C')
    try:
        channel.start_consuming()
    except KeyboardInterrupt:
        channel.stop_consuming()
    connection.close()

def update_user(user_id):
    "Updates a users weight vectors and similarity to other users"
    update_weight_vector_for_user(user_id)
    update_similarities_for_user(user_id)
    update_predictions_for_user(user_id)

def calculate_weight_vector_for_user(user_id, weight_vector_size=200):
    """
    Calculate a weight vector, of the specified size, for the specified
    user. The weight vector is just the difference between the sum of
    the product vectors the user has liked and the product vectors the
    user has disliked.
    """
    # Compute the product vectors
    product_vectors = calculate_product_vectors(weight_vector_size)

    with connection.cursor() as cursor:
        # Get the products that the user likes
        sql = "SELECT PRODUCT_ID as pid FROM LIKES WHERE USER_ID = "+str(user_id)
        cursor.execute(sql)
        like_results = cursor.fetchall()

        # Get the products that the user dislikes
        sql = "SELECT PRODUCT_ID as pid FROM DISLIKES WHERE USER_ID = "+str(user_id)
        cursor.execute(sql)
        dislike_result = cursor.fetchall()

        # Construct the user wights by adding liked products and subtracting disliked products
        weight_vector = np.zeros(weight_vector_size)
        for liked_product in like_results:
            weight_vector = np.add(weight_vector, product_vectors[liked_product['pid']])
        for disliked_product in dislike_result:
            weight_vector = np.subtract(weight_vector, product_vectors[disliked_product['pid']])

        return weight_vector

def update_weight_vector_for_user(user_id):
    "Updates a users weight vector and inserts it into the database"
    print("   Updating weight vector for user: {user_id}...")
    weight_vector = calculate_weight_vector_for_user(user_id)
    #TODO: Insert the weight vector into the user table using user_id.

def update_similarities_for_user(user_id):
    print("   Updating similarities for user: {user_id}...")
    #TODO: Calculate similarity between this user and all other users.

def update_predictions_for_user(user_id):
    print("   Updating neural network classifications for user: {user_id}...")
    # TODO: This should probably be pre calculated.
    product_vectors = calculate_product_vectors()

    with connection.cursor() as cursor:
        cursor.execute("SELECT * FROM USER WHERE USER_ID = "+str(user_id))
        user = cursor.fetchone()
        user_id = user['USER_ID']
        cluster_id = user['USER_CLUSTER_ID']
        #TODO: Perform a database lookup her instead of calculating each time.
        user_weight_vector = calculate_weight_vector_for_user(user_id)

        for product_id, product_vector in product_vectors.items():
            input_vector = product_vector * user_weight_vector
            prediction = classification_models[cluster_id].predict([input_vector])
            cursor.execute("INSERT INTO WEIGHT_VECTOR_RESULTS (USER_ID, PRODUCT_ID, PREDICTION) VALUES ("+str(user_id)+", "+str(product_id)+", "+str(prediction[0])+") ON DUPLICATE KEY UPDATE PREDICTION = "+str(prediction[0]))
            connection.commit()

def main():
    try:
        train_models_for_clusters()
        update_predictions_for_user(2)
        # CNNUpdate.update()
        # rabbitmq_start()
    finally:
        connection.close()

if __name__ == "__main__":
    main()
