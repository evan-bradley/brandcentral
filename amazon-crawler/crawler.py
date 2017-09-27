#-----------------------------------------------------------------
# Created by: Brandon Jackson
# Created on: 09/17/2017
# Last edited by: Brandon Jackson
# Last edit date: 09/17/2017
#
# Use: Pulls data from webpages on Amazon using a pre-compiled list of ASIN codes in the form of a 'B' followed by 9
# alpha-numeric characters.
# Data extracted includes product name and description, category, price, and image link.
#------------------------------------------------------------------

## Todo:
## Change category to tag.
## Implement Clarifai in script to generate list of tags. Save top 20 tags for each record
## 500 products for each category picked
## Need to get ASIN IDs (24/page) -- Separate code, pull ASIN from CSV files

import html
import csv, os, json
import requests
import random
import time
from bs4 import BeautifulSoup
from clarifai.rest import ClarifaiApp

app = ClarifaiApp()


def AmzonParser(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'}
    baseURL = 'https://api.proxycrawl.com/?token=nEz0chhpGslUrRa-aS1gig&url='
    countryURL = '&country=us'
    page = requests.get(url, headers=headers)
    soup = BeautifulSoup(page.content)
    aName = ''
    aTags = []
    aTagStrengths = []
    aPrice = ''
    aDesc = ''
    aImageURL = ''
    try:
        descList = soup.find_all('p')
        nameAndCat = str(soup.title)[19:-8].split(':')
        imageList = soup.find(id='landingImage')['data-a-dynamic-image'].split('\"')
        aName = nameAndCat[0]
        aTags[0] = nameAndCat[1].replace('amp;', '')
        aTagStrengths[0] = 1
        aPrice = soup.find(id = 'priceblock_ourprice').text
        aDesc = soup.find(id = 'productDescription').text.strip()
        aImageURL = imageList[1]

        if page.status_code != 200:
            raise ValueError('captha')

        tags = getTags(aImageURL)

    except Exception as e:
        data = {
            'NAME': '',
            'TAGS': [],
            'TAG_STRENGTH'
            'SALE_PRICE': '',
            'DESCRIPTION': '',
            'IMAGE_URL': '',
            'URL': '',
        }
        return data

    data = {
        'NAME': aName,
        'TAGS': aTags,
        'SALE_PRICE': aPrice,
        'DESCRIPTION': aDesc,
        'IMAGE_URL': aImageURL,
        'URL': url,
    }
    return data

def getTags(image):
    tags = app.tag_urls(image)
    return tags

def ReadAsin():
    # AsinList = csv.DictReader(open(os.path.join(os.path.dirname(__file__),"Asinfeed.csv")))
    AsinList = ['B0046UR4F4'
                # 'B00JGTVU5A',
                # 'B00GJYCIVK',
                # 'B00EPGK7CQ',
                # 'B00EPGKA4G',
                # 'B00YW5DLB4',
                # 'B00KGD0628',
                # 'B00O9A48N2',
                # 'B00O9A4MEW',
                # 'B00UZKG8QU',
                ]
    extracted_data = []
    for i in AsinList:
        url = "http://www.amazon.com/dp/" + i
        print("Processing: " + url)
        data = AmzonParser(url)
        if data['NAME'] != '':
            extracted_data.append(data)
        time.sleep(random.randint(5, 15))
    f = open('data.json', 'w')
    json.dump(extracted_data, f, indent=4)


ReadAsin()