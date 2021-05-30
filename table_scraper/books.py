from posixpath import split
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


df = pd.DataFrame(data=results, columns=headers)

# A few items were flawed, went in and manually fixed in the original json file
# we are using that edited json file here as a master copy that is added onto/edited
df_fixed = pd.read_json("books.json")


# creating a handles array for url end point
# isolate the titles column
unformatted_titles = df_fixed.iloc[:, 1]
unformatted_notes = df_fixed.iloc[:, 5]
base_handles = []
# splitting the note string on the ; and making it an array of notes
split_notes = [note.split(';') for note in unformatted_notes]
df_fixed["Note"] = split_notes


# remove non alphanumeric characters
for title in unformatted_titles:
    base_handles.append(re.sub(r'\W+', ' ', title.lower()))
# repalce spaces with hpyhen
handles = [h.replace(' ', '-') for h in base_handles]
# insert new
df_fixed.insert(2, "handle", handles, True)


# changes the notes string into array split on the semi colon


df_fixed.to_json(r'booksData.json', orient='records')
