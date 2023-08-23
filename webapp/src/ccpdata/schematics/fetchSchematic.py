import csv
import json
import requests

output_file = './schematics.json'

schematics = {}

planetSchematics = requests.get('https://www.fuzzwork.co.uk/dump/latest/planetSchematics.csv').text
planetSchematicsTypeMap = requests.get('https://www.fuzzwork.co.uk/dump/latest/planetSchematicsTypeMap.csv').text
planetSchematicsPinMap = requests.get('https://www.fuzzwork.co.uk/dump/latest/planetSchematicsPinMap.csv').text

reader = csv.reader(planetSchematics.split('\n')[1:])

for row in reader :
  if not row : continue
  schematics[row[0]] = {
    'schematicID': int(row[0]),
    'schematicName': row[1],
    'cycleTime': int(row[2])
  }

reader = csv.reader(planetSchematicsPinMap.split('\n')[1:])

for row in reader :
  if not row : continue
  if 'pins' not in schematics[row[0]] :
    schematics[row[0]]['pins'] = []
  schematics[row[0]]['pins'].append(int(row[1]))

reader = csv.reader(planetSchematicsTypeMap.split('\n')[1:])

for row in reader :
  if not row : continue
  if row[3] == '1' :
    if 'input' not in schematics[row[0]] :
      schematics[row[0]]['input'] = []
    schematics[row[0]]['input'].append({
      'typeID': int(row[1]),
      'quantity': int(row[2])
    })
  elif row[3] == '0' :
    schematics[row[0]]['output'] = {
      'typeID': int(row[1]),
      'quantity': int(row[2])
    }

with open(output_file, 'w') as file :
  json.dump(schematics, file, indent=2)