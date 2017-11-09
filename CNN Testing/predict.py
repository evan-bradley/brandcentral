import tensorflow as tf
import numpy as np
from sklearn.utils import shuffle
import os,glob,cv2
import sys,argparse
import urllib.request
import MySQLdb

def predict(channelID):
    try:
        db = MySQLdb.connect(host="138.197.85.34", user="root", password="somethingeasy", db="BRAND_CENTRAL")
        cursor = db.cursor()
    except MySQLdb.Error:
        print("Error in Connection")

    sqlGetProducts = "SELECT p.PRODUCT_ID, p.PROD_PICT_URL FROM PRODUCT AS p JOIN PROD_TAG_ASSIGN AS pt ON p.PRODUCT_ID = pt.PRODUCT_ID JOIN CHANNEL_TAG_ASSIGN AS ct ON pt.TAG_ID = ct.TAG_ID WHERE ct.CHANNEL_ID = "+str(channelID)
    cursor.execute(sqlGetProducts)

    i = 0
    products = []
    while i < cursor.rowcount:
        row = cursor.fetchone()
        products.append(row)
        i += 1
    products = shuffle(products)
    print(products)

    for product in range(0, len(products)):
        image =

    # First, pass the path of the image
    dir_path = os.path.dirname(os.path.realpath(__file__))
    image_path='test_image/Test2.jpg'
    filename = dir_path +'/' +image_path
    image_size=128
    num_channels=3
    images = []
    # Reading the image using OpenCV
    image = cv2.imread(filename)
    # Resizing the image to our desired size and preprocessing will be done exactly as done during training
    image = cv2.resize(image, (image_size, image_size), cv2.INTER_LINEAR)
    images.append(image)
    images = np.array(images, dtype=np.uint8)
    images = images.astype('float32')
    images = np.multiply(images, 1.0/255.0)
    #The input to the network is of shape [None image_size image_size num_channels]. Hence we reshape.
    x_batch = images.reshape(1, image_size,image_size,num_channels)

    ## Let us restore the saved model
    sess = tf.Session()
    # Step-1: Recreate the network graph. At this step only graph is created.
    saver = tf.train.import_meta_graph('like-dislike-model.meta')
    # Step-2: Now let's load the weights saved using the restore method.
    saver.restore(sess, tf.train.latest_checkpoint('./'))

    # Accessing the default graph which we have restored
    graph = tf.get_default_graph()

    # Now, let's get hold of the op that we can be processed to get the output.
    # In the original network y_pred is the tensor that is the prediction of the network
    y_pred = graph.get_tensor_by_name("y_pred:0")

    ## Let's feed the images to the input placeholders
    x= graph.get_tensor_by_name("x:0")
    y_true = graph.get_tensor_by_name("y_true:0")
    y_test_images = np.zeros((1, 2))


    ### Creating the feed_dict that is required to be fed to calculate y_pred
    feed_dict_testing = {x: x_batch, y_true: y_test_images}
    result=sess.run(y_pred, feed_dict=feed_dict_testing)
    # result is of this format [probabiliy_of_rose probability_of_sunflower]
    print("Like Probability: ",result[0][0],"\nDislike Probability: ",result[0][1])

predict(1)