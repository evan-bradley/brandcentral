import json
import MySQLdb
from pprint import pprint
try:
    db = MySQLdb.connect(host="localhost", user="root", db="brand_central")
    cursor = db.cursor()
except MySQLdb.Error:
    print("Error in Connection")
# cursor.execute("INSERT INTO PRODUCT (PROD_NAME, PROD_DESC, PROD_PICT_URL) VALUES ('Zinus Modern Studio Collection Soho Dining Table with Two Benches / 3 piece set, White', 'Color:White\n\n\nThe Zinus modern Studio collection is an ideal combination of function and style. The Soho dining table set is sturdy, with black steel tubing and a surface panel with rich white finish. The modern Studio collection Soho dining table set will add an elegant touch to any d\u00e9cor. Easy to assemble. Worry free limited 1 year warranty.', 'https://images-na.ssl-images-amazon.com/images/I/71pM9RSt2AL._SX425_.jpg')")
with open('data4.json') as data_file:
    dataList = json.load(data_file)
for product in dataList:
    name = product["NAME"].replace('\'', '').replace('(','').replace(')', '').replace(u"\u201d",'"').replace(u"\u2019", '').strip()
    desc = product["DESCRIPTION"].replace('\'', '').replace('”','"').strip()
    url = product["IMAGE_URL"].replace('\'', '').strip()
    print(name)
    query = """INSERT INTO PRODUCT (PROD_NAME, PROD_DESC, PROD_PICT_URL) VALUES ('%s','%s','%s')""" % (name, desc, url)
    cursor.execute(query)
    # cursor.execute("INSERT INTO PRODUCT (PROD_NAME, PROD_DESC, PROD_PICT_URL) VALUES ('%s','%s','%s')" % (name, desc, url))