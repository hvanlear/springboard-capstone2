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
# df.to_json(r'books.json', orient='records')


# A few items were flawed, went in and manually fixed in the original json file
# we are using that edited json file here as a master copy that used as the starting point
# for future iterations of the data


def formatData(jsonFile, titleCol, notesCol, newJsonFileName):

    df = pd.read_json(jsonFile)
    # creating a handles array
    # isolate the titles column
    titles = df.iloc[:, titleCol]
    notes = df.iloc[:, notesCol]
    # splitting the note string on the ; and making it an array of notes
    split_notes = [note.split(';') for note in notes]

    df.iloc[:, notesCol] = split_notes

    # remove non alpha characters
    base_handles = [(re.sub(r'\W+', ' ', title.lower())) for title in titles]
    handles = [h.replace(' ', '-') for h in base_handles]

    df.insert(2, "handle", handles, True)
    df.to_json(newJsonFileName, orient='records')


formatData("books.json", 1, 5, "booksTempData.json")
