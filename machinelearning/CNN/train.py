# Based off tutorial found at https://github.com/sankit1/cv-tricks.com

import dataset
import tensorflow as tf
import time
from datetime import timedelta
import math
import random
import os, shutil
import numpy as np
import urllib.request
import MySQLdb

#Adding Seed so that random initialization is consistent
from numpy.random import seed
seed(1)
from tensorflow import set_random_seed
set_random_seed(2)

dir_path = os.path.dirname(os.path.realpath(__file__))

batch_size = 32

#Prepare input data
classes = ['Like','Dislike']
num_classes = len(classes)

# 20% of the data will automatically be used for validation
validation_size = 0.2
img_size = 128
num_channels = 3
train_path='training_data'

# db = MySQLdb.connect(host="138.197.85.34", user="root", password="somethingeasy", db="BRAND_CENTRAL")
db = MySQLdb.connect(host="localhost", user="root", db="BRAND_CENTRAL")
cursor = db.cursor()

session = tf.Session()
x = tf.placeholder(tf.float32, shape=[None, img_size,img_size,num_channels], name='x')

## labels
y_true = tf.placeholder(tf.float32, shape=[None, num_classes], name='y_true')
y_true_cls = tf.argmax(y_true, dimension=1)



##Network graph params
filter_size_conv1 = 3 
num_filters_conv1 = 32

filter_size_conv2 = 3
num_filters_conv2 = 32

filter_size_conv3 = 3
num_filters_conv3 = 64
    
fc_layer_size = 128

def create_weights(shape):
    return tf.Variable(tf.truncated_normal(shape, stddev=0.05))

def create_biases(size):
    return tf.Variable(tf.constant(0.05, shape=[size]))



def create_convolutional_layer(input,
               num_input_channels, 
               conv_filter_size,        
               num_filters):  
    
    ## We shall define the weights that will be trained using create_weights function.
    weights = create_weights(shape=[conv_filter_size, conv_filter_size, num_input_channels, num_filters])
    ## We create biases using the create_biases function. These are also trained.
    biases = create_biases(num_filters)

    ## Creating the convolutional layer
    layer = tf.nn.conv2d(input=input,
                     filter=weights,
                     strides=[1, 1, 1, 1],
                     padding='SAME')

    layer += biases

    ## We shall be using max-pooling.  
    layer = tf.nn.max_pool(value=layer,
                            ksize=[1, 2, 2, 1],
                            strides=[1, 2, 2, 1],
                            padding='SAME')
    ## Output of pooling is fed to Relu which is the activation function for us.
    layer = tf.nn.relu(layer)

    return layer

    

def create_flatten_layer(layer):
    #We know that the shape of the layer will be [batch_size img_size img_size num_channels] 
    # But let's get it from the previous layer.
    layer_shape = layer.get_shape()

    ## Number of features will be img_height * img_width* num_channels. But we shall calculate it in place of hard-coding it.
    num_features = layer_shape[1:4].num_elements()

    ## Now, we Flatten the layer so we shall have to reshape to num_features
    layer = tf.reshape(layer, [-1, num_features])

    return layer


def create_fc_layer(input,          
             num_inputs,    
             num_outputs,
             use_relu=True):
    
    #Let's define trainable weights and biases.
    weights = create_weights(shape=[num_inputs, num_outputs])
    biases = create_biases(num_outputs)

    # Fully connected layer takes input x and produces wx+b.Since, these are matrices, we use matmul function in Tensorflow
    layer = tf.matmul(input, weights) + biases
    if use_relu:
        layer = tf.nn.relu(layer)

    return layer


layer_conv1 = create_convolutional_layer(input=x,
               num_input_channels=num_channels,
               conv_filter_size=filter_size_conv1,
               num_filters=num_filters_conv1)

layer_pool1 = tf.layers.max_pooling2d(inputs=layer_conv1, pool_size=[2, 2], strides=2)

layer_conv2 = create_convolutional_layer(input=layer_pool1,
               num_input_channels=num_filters_conv1,
               conv_filter_size=filter_size_conv2,
               num_filters=num_filters_conv2)

layer_pool2 = tf.layers.max_pooling2d(inputs=layer_conv2, pool_size=[2, 2], strides=2)

layer_conv3= create_convolutional_layer(input=layer_pool2,
               num_input_channels=num_filters_conv2,
               conv_filter_size=filter_size_conv3,
               num_filters=num_filters_conv3)
          
layer_flat = create_flatten_layer(layer_conv3)

layer_fc1 = create_fc_layer(input=layer_flat,
                     num_inputs=layer_flat.get_shape()[1:4].num_elements(),
                     num_outputs=fc_layer_size,
                     use_relu=True)

layer_fc2 = create_fc_layer(input=layer_fc1,
                     num_inputs=fc_layer_size,
                     num_outputs=num_classes,
                     use_relu=False) 

y_pred = tf.nn.softmax(layer_fc2,name='y_pred')

y_pred_cls = tf.argmax(y_pred, dimension=1)
session.run(tf.global_variables_initializer())
cross_entropy = tf.nn.softmax_cross_entropy_with_logits(logits=layer_fc2,
                                                    labels=y_true)
cost = tf.reduce_mean(cross_entropy)
optimizer = tf.train.AdamOptimizer(learning_rate=1e-3).minimize(cost)
correct_prediction = tf.equal(y_pred_cls, y_true_cls)
accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))


session.run(tf.global_variables_initializer()) 


def show_progress(epoch, feed_dict_train, feed_dict_validate, val_loss):
    acc = session.run(accuracy, feed_dict=feed_dict_train)
    val_acc = session.run(accuracy, feed_dict=feed_dict_validate)
    msg = "Training Epoch {0} --- Training Accuracy: {1:>6.1%}, Validation Accuracy: {2:>6.1%},  Validation Loss: {3:.3f}"
    print(msg.format(epoch + 1, acc, val_acc, val_loss))

total_iterations = 0

saver = tf.train.Saver()
def train(num_iteration, clusterNum):
    global total_iterations

    # Load all the training and validation images and labels into memory using openCV and use that during training
    data = dataset.read_train_sets(train_path, img_size, classes, validation_size=validation_size)

    print("Complete reading input data. Will Now print a snippet of it")
    print("Number of files in Training-set:\t\t{}".format(len(data.train.labels)))
    print("Number of files in Validation-set:\t{}".format(len(data.valid.labels)))

    for i in range(total_iterations,
                   total_iterations + num_iteration):

        x_batch, y_true_batch, _, cls_batch = data.train.next_batch(batch_size)
        x_valid_batch, y_valid_batch, _, valid_cls_batch = data.valid.next_batch(batch_size)

        
        feed_dict_tr = {x: x_batch,
                           y_true: y_true_batch}
        feed_dict_val = {x: x_valid_batch,
                              y_true: y_valid_batch}

        session.run(optimizer, feed_dict=feed_dict_tr)

        if i % int(data.train.num_examples/batch_size) == 0: 
            val_loss = session.run(cost, feed_dict=feed_dict_val)
            epoch = int(i / int(data.train.num_examples/batch_size))
            
            show_progress(epoch, feed_dict_tr, feed_dict_val, val_loss)
            saver.save(session,
                       dir_path+'/like-dislike-model'+str(clusterNum))


    total_iterations += num_iteration


def trainClusters(iterations):

    sqlGetClusterProducts = "SELECT PRODUCT_ID, PROD_PICT_URL FROM PRODUCT"
    cursor.execute(sqlGetClusterProducts)
    products = cursor.fetchall()

    sqlGetClusters = "SELECT DISTINCT CLUSTER_ID FROM CNN_RESULTS"
    cursor.execute(sqlGetClusters)
    clusterCount = cursor.rowcount

    for cluster in range(1, clusterCount + 1):
        if not os.path.exists('./'+train_path+'/Like'):
            os.makedirs('./'+train_path+'/Like')
        if not os.path.exists('./' + train_path + '/Dislike'):
            os.makedirs('./' + train_path + '/Dislike')

        likeStmt = "SELECT DISTINCT PRODUCT.PRODUCT_ID, PROD_PICT_URL, USER_CLUSTER_ID, USER.USER_ID FROM LIKES JOIN USER ON LIKES.USER_ID = USER.USER_ID JOIN PRODUCT ON PRODUCT.PRODUCT_ID = LIKES.PRODUCT_ID WHERE USER_CLUSTER_ID = "+str(cluster)
        dislikeStmt = "SELECT DISTINCT PRODUCT.PRODUCT_ID, PROD_PICT_URL, USER_CLUSTER_ID, USER.USER_ID FROM DISLIKES JOIN USER ON DISLIKES.USER_ID = USER.USER_ID JOIN PRODUCT ON PRODUCT.PRODUCT_ID = DISLIKES.PRODUCT_ID WHERE USER_CLUSTER_ID = "+str(cluster)

        cursor.execute(likeStmt)
        for prod in range(0, cursor.rowcount):
            product = cursor.fetchone()
            urllib.request.urlretrieve(product[1], train_path+'/Like/product'+str(prod)+'.jpg')

        cursor.execute(dislikeStmt)
        for prod in range(0, cursor.rowcount):
            product = cursor.fetchone()
            urllib.request.urlretrieve(product[1], train_path+'/Dislike/product'+str(prod)+'.jpg')

        train(num_iteration=iterations, clusterNum=cluster)
        shutil.rmtree('./'+train_path+'/Like')
        shutil.rmtree('./' + train_path + '/Dislike')
trainClusters(120)