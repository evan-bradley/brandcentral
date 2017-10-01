import html
import requests
import time
from bs4 import BeautifulSoup

amazon = 'https://www.amazon.com'
url = '/s/ref=lp_3735061_pg_2?rh=n%3A1055398%2Cn%3A!1063498%2Cn%3A1063278%2Cn%3A3735061&page=2&ie=UTF8&qid=1506558832'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36'}

ASINs = []

while len(ASINs) <= 525:
    page = requests.get(amazon + url, headers=headers)
    soup = BeautifulSoup(page.content)
    results = soup.findAll("li", {"class" : "s-result-item"})
    # results2 = results.contents.findAll("li", {"class" : 's-result-item'})
    # print(results[0].attrs['data-asin'])

    for r in range(len(results)):
            try:
                    ASINs.append((results[r].attrs['data-asin']))
            except:
                    continue
    next = soup.find("span", {"class": "pagnRA"})
    url = next.contents[1].attrs['href']
    # time.sleep(5)

ASIN_LIST = ''
for i in range(len(ASINs)):
    ASIN_LIST = ASIN_LIST + ASINs[i] + ','
print(ASIN_LIST)