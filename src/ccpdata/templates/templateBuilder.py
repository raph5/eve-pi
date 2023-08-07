"""
Un joli petit script pour convertir les templates ccpwgl en templates pour eve-pi
"""

import json
import sys

# get cmd params
input_file = sys.argv[1]
output_file = sys.argv[2]

# open json raw ccpwgl template
with open(input_file, 'r') as file :
  raw_template = json.load(file)

# get params
def get_params(template) :

  if type(template) == dict or type(template) == list or type(template) == tuple :

    params = {}
    
    if type(template) == dict :
      for i in template :
        if i == 'parameters' :
          params.update(template[i])
        params.update(get_params(template[i]))
  
    elif type(template) == list or type(template) == tuple :
      for i in template :
        params.update(get_params(i))

    return params
  
  else :
    return {}

params = get_params(raw_template)

# add params to template
template = { 'textures': {}, 'settings': {} }
for p in params :
  if params[p]['type'] == 'Tw2TextureParameter':
    if params[p].get('resourcePath') :
      template['textures'][p] = params[p]['resourcePath']
  elif params[p]['type'] == 'Tw2Vector4Parameter':
    if params[p].get('value') :
      template['settings'][p] = [
        params[p]['value']['0'],
        params[p]['value']['1'],
        params[p]['value']['2'],
        params[p]['value']['3']
      ]
  elif params[p]['type'] == 'Tw2FloatParameter':
    if params[p].get('value') :
      template['settings'][p] = params[p]['value']
  else :
    raise ValueError("can't handle param type " + params[p].get('type'))

with open(output_file, 'w') as file :
  json.dump(template, file, indent=2)