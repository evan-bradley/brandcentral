import urllib
import MySQLdb
import requests
from PIL import Image
from io import BytesIO

# URL = "https://images-na.ssl-images-amazon.com/images/I/81kitUE%2BznL._SY450_.jpg"

try:
    db = MySQLdb.connect(host="localhost", user="root", db="brand_central")
    db.set_character_set('utf8')
    cursor = db.cursor()
    cursor.execute('SET NAMES utf8;')
    cursor.execute('SET CHARACTER SET utf8;')
    cursor.execute('SET character_set_connection=utf8;')
except MySQLdb.Error:
    print("Error in Connection")

query = """SELECT PRODUCT_ID, PROD_PICT_URL, PROD_PICT_HEIGHT, PROD_PICT_WIDTH FROM PRODUCT"""
cursor.execute(query)

for (PRODUCT_ID, PROD_PICT_URL, PROD_PICT_HEIGHT, PROD_PICT_WIDTH) in cursor:
    response = requests.get(PROD_PICT_URL)
    im = Image.open(BytesIO(response.content))
    print(im.size[0], im.size[1])
    insQuery = """UPDATE PRODUCT SET PROD_PICT_WIDTH = '%d', PROD_PICT_HEIGHT = '%d' WHERE PRODUCT_ID = '%d' """ % (im.size[0], im.size[1], PRODUCT_ID)
    cursor.execute(insQuery)
db.commit()