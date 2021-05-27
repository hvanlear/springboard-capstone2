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

wiki = "https://en.wikipedia.org/wiki/Stephen_King_bibliography"

req = requests.get(wiki)
soup = BeautifulSoup(req.content, 'html.parser')
table_class = {"class": "wikitable"}
wiki_tables = soup.find_all('table', table_class)

tmp = wiki_tables[0].find_all('tr')
first = tmp[0]
all_rows = tmp[1:-1]
print(first)

headers = [header.get_text().lower().rstrip("\n")
           for header in first.find_all('th')]
results = [[data.get_text().rstrip("\n") for data in row.find_all('td')]
           for row in all_rows]


rowspan = []

for no, tr in enumerate(all_rows):
    tmp = []
    for td_no, data in enumerate(tr.find_all('td')):
        if data.has_key('rowspan'):
            rowspan.append(
                (no, td_no, int(data['rowspan']), data.get_text().rstrip("\n")))

if rowspan:
    for i in rowspan:
        for j in range(1, i[2]):
            results[i[0]+j].insert(i[1], i[3])

print(headers)

df = pd.DataFrame(data=results, columns=headers)

# A few items were flawed, went in and manually fixed
df_fixed = pd.read_json("books.json")

# creating a handles array for url end point
# isolate the titles column
raw_handles = df_fixed.iloc[:, 1]
base_handles = []

# remove non alphanumeric characters
for handle in raw_handles:
    base_handles.append(re.sub(r'\W+', ' ', handle.lower()))
# repalce spaces with hpyhen
handles = [h.replace(' ', '-') for h in base_handles]
# insert new
df_fixed.insert(2, "handle", handles, True)


df_fixed.to_json(r'booksData.json', orient='records')

# print(handles)
