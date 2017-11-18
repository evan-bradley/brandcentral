import tensorflow as tf
import numpy as np
from sklearn.utils import shuffle
import os,glob,cv2
import time
import sys,argparse
import urllib.request
from PIL import Image
import MySQLdb

def updatePredictions():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    image_path = 'product.jpg'
    filename = dir_path + '/' + image_path

    image_size = 128
    num_channels = 3

    updateStmt = ""

    try:
        db = MySQLdb.connect(host="138.197.85.34", user="root", password="somethingeasy", db="BRAND_CENTRAL")
        # db = MySQLdb.connect(host="localhost", user="root", db="BRAND_CENTRAL")
        cursor = db.cursor()
    except MySQLdb.Error:
        print("Error in Connection")

    sqlGetClusterProducts = "SELECT PRODUCT_ID, PROD_PICT_URL FROM PRODUCT"
    cursor.execute(sqlGetClusterProducts)
    products = cursor.fetchall()

    sqlGetClusters = "SELECT DISTINCT CLUSTER_ID FROM CNN_RESULTS"
    cursor.execute(sqlGetClusters)
    clusterCount = cursor.rowcount

    for cluster in range(1, clusterCount+1):
        # Restore the saved model
        sess = tf.Session()
        # Step-1: Recreate the network graph. At this step only graph is created.
        saver = tf.train.import_meta_graph('like-dislike-model.meta')
        # Step-2: Now let's load the weights saved using the restore method.
        saver.restore(sess, tf.train.latest_checkpoint('./'))

        # Accessing the restored graph
        graph = tf.get_default_graph()
        y_pred = graph.get_tensor_by_name("y_pred:0")

        # Feed the images to the input placeholders
        x = graph.get_tensor_by_name("x:0")
        y_true = graph.get_tensor_by_name("y_true:0")
        y_test_images = np.zeros((1, 2))

        for product in range(1, len(products)+1):
            urllib.request.urlretrieve(products[product][1], 'product.jpg')

            # Reading the image using OpenCV
            image = cv2.imread(filename)
            # Resizing the image to our desired size and preprocessing will be done exactly as done during training
            image = cv2.resize(image, (image_size, image_size), cv2.INTER_LINEAR)
            image = np.array(image, dtype=np.uint8)
            image = image.astype('float32')
            image = np.multiply(image, 1.0 / 255.0)
            # The input to the network is of shape [None image_size image_size num_channels]. Hence we reshape.
            x_batch = image.reshape(1, image_size, image_size, num_channels)

            # Creating the feed_dict that is required to be fed to calculate y_pred
            feed_dict_testing = {x: x_batch, y_true: y_test_images}
            result = sess.run(y_pred, feed_dict=feed_dict_testing)

            curTime = time.strftime('%Y-%m-%d %H:%M:%S')
            strUpdate = "UPDATE CNN_RESULTS SET LIKE_PCT = "+str(result[0][0])+", LAST_UPDATE = '"+curTime+"' WHERE CLUSTER_ID = "+str(cluster)+" AND PRODUCT_ID = "+str(product)
            print(strUpdate)
            cursor.execute(strUpdate)
            db.commit()
updatePredictions()