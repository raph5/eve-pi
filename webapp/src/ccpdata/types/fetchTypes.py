import json
import requests

def pick(obj, *keys) :
  d = {}
  for key in keys :
    d[key] = obj[key]
  return d

output_file = './types.json'

types = {}

typesID = []
typesID += requests.get('https://esi.evetech.net/latest/markets/groups/1337').json()['types']
typesID += requests.get('https://esi.evetech.net/latest/markets/groups/1334').json()['types']
typesID += requests.get('https://esi.evetech.net/latest/markets/groups/1333').json()['types']
typesID += requests.get('https://esi.evetech.net/latest/markets/groups/1335').json()['types']
typesID += requests.get('https://esi.evetech.net/latest/markets/groups/1336').json()['types']

for group in requests.get('https://esi.evetech.net/latest/universe/categories/41').json()['groups'] :
  typesID += requests.get('https://esi.evetech.net/latest/universe/groups/' + str(group)).json()['types']

for t in typesID :
  rep = requests.get('https://esi.evetech.net/latest/universe/types/' + str(t)).json()
  types[rep['type_id']] = pick(rep, 'name', 'type_id', 'volume', 'capacity', 'group_id')
  print(rep['name'])

with open(output_file, 'w') as file :
  json.dump(types, file, indent=2)