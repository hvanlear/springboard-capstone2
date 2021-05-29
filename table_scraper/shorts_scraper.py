from bs4 import BeautifulSoup
from lxml.html import fromstring
import re
import csv
import pandas as pd
import urllib3

import requests

# http = urllib3.PoolManager()
# wiki = "https://en.wikipedia.org/wiki/Stephen_King_bibliography"
# req = http.request('GET', wiki)

# soup = BeautifulSoup(req, 'html.parser')
# table = soup.find_all('table', {"class": "wikitable"})

# print(table)

# wiki = "https://en.wikipedia.org/wiki/Stephen_King_bibliography"
wiki = "https://en.wikipedia.org/wiki/Stephen_King_short_fiction_bibliography"

req = requests.get(wiki)
soup = BeautifulSoup(req.content, 'html.parser')
table_class = {"class": "wikitable"}
wiki_tables = soup.find_all('table', table_class)

# Go through wiki and grab all the individual date headlines above every table
root = soup.find_all('div', {"class": "mw-parser-output"})
dateHeadings = root[0].find_all('h3')
dates = [heading.find_all('span', {"class": "mw-headline"})[0].get_text().lower().rstrip("\n")
         for heading in dateHeadings]

first = wiki_tables[0].find_all('tr')

headers = [header.get_text().lower().rstrip("\n")
           for header in first[0].find_all('th')]
headers.append('Date')


def scrape_table(wikiTable):
    tmp = wikiTable.find_all('tr')
    all_rows = tmp[1:]

    results = [[data.get_text().rstrip("\n") for data in row.find_all('td')]
               for row in all_rows]

    rowspan = []

    for no, tr in enumerate(all_rows):
        tmp = []
        for td_no, data in enumerate(tr.find_all('td')):
            if data.has_attr('rowspan'):
                rowspan.append(
                    (no, td_no, int(data['rowspan']), data.get_text().rstrip("\n")))

    if rowspan:
        for i in rowspan:
            for j in range(1, i[2]):
                results[i[0]+j].insert(i[1], i[3])

    # print(headers)

    return results


combined = []
results = [scrape_table(table) for table in wiki_tables]

for i, value in enumerate(results, start=0):
    for row in value:
        row.append(dates[i])
    combined = combined + value

print(combined)

df = pd.DataFrame(data=combined, columns=headers)
df.to_json(r'shortsData.json', orient='records')
