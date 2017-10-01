# -----------------------------------------------------------------
# Created by: Brandon Jackson
# Created on: 09/17/2017
# Last edited by: Brandon Jackson
# Last edit date: 09/27/2017
#
# Use: Pulls data from webpages on Amazon using a pre-compiled list of ASIN codes in the form of a 'B' followed by 9
# alpha-numeric characters.
# Data extracted includes product name and description, category, price, and image link.
# ------------------------------------------------------------------

import html
import csv, os, json
import requests
import random
import time
from bs4 import BeautifulSoup
from clarifai.rest import ClarifaiApp

# app = ClarifaiApp(api_key='d2e62b5a4dbf45209c30f5581ae0070c')
app = ClarifaiApp(api_key='fd32492d0ec1457a848fac3dbd816d1c')


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
    #aPrice = ''
    aDesc = ''
    aImageURL = ''
    try:
        descList = soup.find_all('p')
        nameAndCat = str(soup.title)[19:-8].split(':')
        imageList = soup.find(id='landingImage')['data-a-dynamic-image'].split('\"')
        aName = nameAndCat[0]
        aTags.append(nameAndCat[1].replace('amp;', ''))
        if nameAndCat[1] == '':
            aTagStrengths.append(0.00)
        aTagStrengths.append(1.00)
        # aPrice = soup.find(id='priceblock_ourprice').text
        aDesc = soup.find(id='productDescription').text.strip()
        aImageURL = imageList[1]

        if page.status_code != 200:
            raise ValueError('captha')

        tagData = getTags([aImageURL])
        tagCount = 0
        for i in range(len(tagData)):
            tagCount += 1
            if tagCount > 20:
                break
            aTags.append(tagData[i]['name'])
            aTagStrengths.append((tagData[i]['value']))

    except Exception as e:
        data = {
            'NAME': '',
            'TAGS': [],
            'TAG_STRENGTH': [],
            #'SALE_PRICE': '',
            'DESCRIPTION': '',
            'IMAGE_URL': '',
            'URL': '',
        }
        return data

    data = {
        'NAME': aName,
        'TAGS': aTags,
        'TAG_STRENGTH': aTagStrengths,
        #'SALE_PRICE': aPrice,
        'DESCRIPTION': aDesc,
        'IMAGE_URL': aImageURL,
        'URL': url,
    }
    return data


def getTags(image):
    tagjson = app.tag_urls(image)
    # tagjson = {'status': {'code': 10000, 'description': 'Ok'}, 'outputs': [{'data': {'concepts': [{'id': 'ai_XjXrH3qf', 'app_id': 'main', 'name': 'electronics', 'value': 0.9923344}, {'id': 'ai_62K34TR4', 'app_id': 'main', 'name': 'technology', 'value': 0.9919262}, {'id': 'ai_0qS6nzzT', 'app_id': 'main', 'name': 'wireless', 'value': 0.98861885}, {'id': 'ai_hHMzVnx2', 'app_id': 'main', 'name': 'internet', 'value': 0.9828497}, {'id': 'ai_9kHRpGGd', 'app_id': 'main', 'name': 'data', 'value': 0.9769256}, {'id': 'ai_PpTcwbdQ', 'app_id': 'main', 'name': 'computer', 'value': 0.9651676}, {'id': 'ai_pPJbNBqf', 'app_id': 'main', 'name': 'connection', 'value': 0.9641251}, {'id': 'ai_786Zr311', 'app_id': 'main', 'name': 'no person', 'value': 0.96185076}, {'id': 'ai_GzNlpxwb', 'app_id': 'main', 'name': 'equipment', 'value': 0.96104497}, {'id': 'ai_kCTh39XG', 'app_id': 'main', 'name': 'communication', 'value': 0.9475552}, {'id': 'ai_Qbldzzv0', 'app_id': 'main', 'name': 'device', 'value': 0.94483846}, {'id': 'ai_6lhccv44', 'app_id': 'main', 'name': 'business', 'value': 0.94292736}, {'id': 'ai_6KkVGbdm', 'app_id': 'main', 'name': 'telephone', 'value': 0.93789387}, {'id': 'ai_P7RlXrSh', 'app_id': 'main', 'name': 'telecommunication', 'value': 0.9371295}, {'id': 'ai_jdqLsqcW', 'app_id': 'main', 'name': 'machinery', 'value': 0.9322409}, {'id': 'ai_Hr8K2Npx', 'app_id': 'main', 'name': 'portable', 'value': 0.9252615}, {'id': 'ai_hQ4FhHwQ', 'app_id': 'main', 'name': 'network', 'value': 0.9160806}, {'id': 'ai_4sJ4TWMt', 'app_id': 'main', 'name': 'cellular telephone', 'value': 0.9127233}, {'id': 'ai_rxcHpHks', 'app_id': 'main', 'name': 'isolated', 'value': 0.9113432}, {'id': 'ai_9wr8Qssf', 'app_id': 'main', 'name': 'service', 'value': 0.89364004}]}, 'id': 'a479ac248387400ba261c7c9aab3bb5e', 'status': {'code': 10000, 'description': 'Ok'}, 'input': {'data': {'image': {'url': 'https://images-na.ssl-images-amazon.com/images/I/717HFf5wbWL._SY355_.jpg'}}, 'id': 'b2e784f7c80c4516bcffeb8108bcee5e'}, 'created_at': '2017-09-24T20:21:14.893584706Z', 'model': {'id': 'aaa03c23b3724a16a56b629203edc62c', 'output_info': {'type_ext': 'concept', 'message': 'Show output_info with: GET /models/{model_id}/output_info', 'type': 'concept'}, 'created_at': '2016-03-09T17:11:39.608845Z', 'display_name': 'General', 'model_version': {'created_at': '2016-07-13T01:19:12.147644Z', 'id': 'aa9ca48295b37401f8af92ad1af0d91d', 'status': {'code': 21100, 'description': 'Model trained successfully'}}, 'app_id': 'main', 'name': 'general-v1.3'}}]}
    outputs = tagjson['outputs'][0]['data']['concepts']
    return outputs


def ReadAsin():
    AsinList = csv.reader(open("D:/Google Drive/School/Oakland University/Fall 2017/CSE 480/ASINs2.csv"))
    # AsinList = ['B0046UR4F4',
    #             'B00JGTVU5A',
    #             'B00GJYCIVK',
    #             'B00EPGK7CQ',
    #             'B00EPGKA4G',
    #             'B00YW5DLB4',
    #             'B00KGD0628',
    #             'B00O9A48N2',
    #             'B00O9A4MEW',
    #             'B00UZKG8QU']
    fileNumber = 2
    extractedData = []
    count = 0
    for row in AsinList:
        with open('data' + str(fileNumber) + '.json', 'w') as f:
            for col in row:
                # if count == 4950:
                #     app = ClarifaiApp(api_key='fd32492d0ec1457a848fac3dbd816d1c')
                url = "http://www.amazon.com/dp/" + str(col)
                print("Processing: " + url)
                data = AmzonParser(url)
                if data['NAME'] != '':
                    extractedData.append(data)
                    continue
                count += 1
                time.sleep(random.randint(5, 10))
            json.dump(extractedData, f, indent=4)
            extractedData = []
            fileNumber += 1

ReadAsin()