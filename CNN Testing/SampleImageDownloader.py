import urllib.request
import os
import MySQLdb

modelSaveLocation = 'C:/Users/bjack/Downloads/CNN Testing/like-dislike-model'
# pictureSaveRoot = 'C:/Users/bjack/Downloads/CNN Testing/training_data/'


try:
    db = MySQLdb.connect(host="138.197.85.34", user="root", password="somethingeasy", db="BRAND_CENTRAL")
    cursor = db.cursor()
except MySQLdb.Error:
    print("Error in Connection")

strQuery1 = "SELECT LIKES.PRODUCT_ID, PRODUCT.PROD_PICT_URL, 'LIKE' FROM LIKES JOIN PRODUCT ON LIKES.PRODUCT_ID = PRODUCT.PRODUCT_ID WHERE USER_ID = 2"
strQuery2 = "SELECT DISLIKES.PRODUCT_ID, PRODUCT.PROD_PICT_URL, 'DISLIKE' FROM DISLIKES JOIN PRODUCT ON DISLIKES.PRODUCT_ID = PRODUCT.PRODUCT_ID WHERE USER_ID = 2"

cursor.execute(strQuery1)
if cursor.rowcount > 0:
    print(cursor.rowcount)
    i = 0
    while i < cursor.rowcount:
        row = cursor.fetchone()
        urllib.request.urlretrieve(row[1], 'like.'+str(i)+'.jpg')
        i+= 1
        print(i)
