import json
import sys
import os

def prompt_texture_param(textureName) :
  print('\n' + textureName)
  repeat = input("repeat ? [N/y] ")
  min_filter = input("linear minFilter ? [N/y] ")
  anisotropy = input("anisotropy ? [4] ")
  repeat = True if repeat == 'y' else False
  min_filter = 'linear' if min_filter == 'y' else 'linearMipmap'
  anisotropy = 4 if anisotropy == '' else int(anisotropy)
  return {
    'repeat': repeat,
    'minFilter': min_filter,
    'anisotropy': anisotropy
  }

dir_to_fix = sys.argv[1]
files_to_fix = os.listdir(dir_to_fix)
settings = {}

for f in files_to_fix :

  with open(f"{dir_to_fix}/{f}", 'r') as file :
    template = json.load(file)
  
  if not settings :
    for t in template['textures'] :
      settings[t] = prompt_texture_param(t)

  for t in template['textures'].keys() :
    template['textures'][t] = { 'src': template['textures'][t] }
    template['textures'][t].update(settings[t])
  
  with open(f"{dir_to_fix}/{f}", 'w') as file :
    json.dump(template, file, indent=2)