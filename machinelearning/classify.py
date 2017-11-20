import pymysql.cursors
import hashlib
import operator
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import classification_report,confusion_matrix,accuracy_score
from random import *

# Create a connection to the mysql database
connection = pymysql.connect(host='brandcentral.xyz',
                             user='root',
                             password='somethingeasy',
                             db='BRAND_CENTRAL',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)

def calculate_product_vectors(vector_length):
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

def cluster_users(number_of_clusters):
    """
    Computes the cluster means for the specified number of clusters.
    """
    # Get the user weight vectors, because we want to cluster users
    user_weights = calculate_user_weight_vectors(300)

    # Perform clustering using K Means
    user_weights_array = np.array(list(user_weights.values()))
    print(user_weights_array.shape)
    kmeans = KMeans(n_clusters=number_of_clusters).fit(user_weights_array)
    print("Number of Clusters:", number_of_clusters)
    print("Cluster Labels:", kmeans.labels_)
    print("Cluster Means:", kmeans.cluster_centers_)
    return kmean.labels_

def data(vector_length):
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
        
        # Multiply each product by the like/dislike and add it to the dataset
        dataset = {'data':[], 'label':[]}
        for item in like_results:
            dataset['data'].append(user_weights[item['uid']] * product_vectors[item['pid']])
            dataset['label'].append(1)
        for item in dislike_result:
            dataset['data'].append(user_weights[item['uid']] * product_vectors[item['pid']])
            dataset['label'].append(0)
        return dataset

def data_train_test():
    dataset = data(200)
    X = dataset['data']
    y = dataset['label']

    from sklearn.model_selection import train_test_split
    X_train, X_test, y_train, y_test = train_test_split(X, y)

    from sklearn.preprocessing import StandardScaler
    scaler = StandardScaler()
    # Fit only to the training data
    scaler.fit(X_train)
    # Now apply the transformations to the data:
    X_train = scaler.transform(X_train)
    X_test = scaler.transform(X_test)

    return X, y, X_train, X_test, y_train, y_test

def classify():
    from matplotlib.colors import ListedColormap
    from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler
    from sklearn.datasets import make_moons, make_circles, make_classification
    from sklearn.neural_network import MLPClassifier
    from sklearn.neighbors import KNeighborsClassifier
    from sklearn.svm import SVC
    from sklearn.gaussian_process import GaussianProcessClassifier
    from sklearn.gaussian_process.kernels import RBF
    from sklearn.tree import DecisionTreeClassifier
    from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier, VotingClassifier
    from sklearn.naive_bayes import GaussianNB
    from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis
    from sklearn.model_selection import cross_val_score, cross_val_predict

    # Retrieve the training data and test data
    X, y, X_train, X_test, y_train, y_test = data_train_test()

    # Specify the classifiers we would like to test
    classifiers = {
        "Nearest Neighbors (1)": KNeighborsClassifier(1),
        "Nearest Neighbors (3)": KNeighborsClassifier(3),
        "Nearest Neighbors (5)": KNeighborsClassifier(5),
        "Nearest Neighbors (7)": KNeighborsClassifier(7),
        "Naive Bayes": GaussianNB(),
        "Neural Net (30, 30, 30)": MLPClassifier(hidden_layer_sizes=(30,30,30), max_iter=1000),
        "Neural Net NHL": MLPClassifier(max_iter=1000),
        "Decision Tree": DecisionTreeClassifier(max_depth=5),
        "Random Forest (Ensemble)": RandomForestClassifier(max_depth=30, n_estimators=100, max_features=1),
        "Linear SVM": SVC(kernel="linear", C=0.025),
        "RBF SVM": SVC(gamma=2, C=1),
        "AdaBoost": AdaBoostClassifier(),
        "Voting (Ensemble)": VotingClassifier(estimators=[
            ('nn1', MLPClassifier(max_iter=1000)),
            ('nn2', MLPClassifier(max_iter=1000)),
            ('nn3', MLPClassifier(max_iter=1000))], voting='hard')
    }

    # Compute the accuracy of each classifier using cross validation
    accuracies = {}
    for name, clf in classifiers.items():
        print('Training', name, '...')
        scores = cross_val_score(clf, X, y, cv=5)
        accuracies[name] = np.mean(scores)
        
    # Print a sorted list of accuracies to the console
    i = 1
    for key, value in sorted(accuracies.items(), key=operator.itemgetter(1), reverse=True):
        print("%-*s) %-*s: %s" % (2, i, 25, key, value))
        i += 1
        

def print_header(text):
    print("======================================================")
    print(text)
    print("======================================================")

def rabbitmq_setup():
    import pika
    credentials = pika.PlainCredentials('brandcentral', 'brandcentral')
    parameters = pika.ConnectionParameters('brandcentral.xyz', 5672, '/', credentials)
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    def callback(ch, method, properties, body):
        update_db(1) 
        print(" [x] Received %r" % body)

    channel.basic_consume(callback, queue='train', no_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()

def update_db(cluster_id):
    print(cluster_id)
    clustered_users = cluster_users(5)


def main():
    try:
        print_header("Clustering")
        cluster_users(5)

        print_header("Classification")
        classify()
    finally:
        connection.close()
    rabbitmq_setup()

if __name__ == "__main__":
    main()
