"""
Un joli petit script pour convertir les fragment shaders ccpwgl en shaders pour eve-pi
"""

import json
import sys
import re

def process_for_regex(pattern) :
  pattern = pattern.replace('[', r'\[')
  pattern = pattern.replace(']', r'\]')
  return pattern

# get cmd params
input_file = sys.argv[1]
output_file = sys.argv[2]
config_file = sys.argv[3] if len(sys.argv) > 3 else './fragShaderBuilder.json'
sun_direction_file = sys.argv[4] if len(sys.argv) > 4 else '../../lib/planets/shaders/getSunDirection.glsl'

# open json raw ccpwgl shader and config file
with open(input_file, 'r') as file :
  shader = file.read()
with open(config_file, 'r') as file :
  config = json.load(file)
with open(sun_direction_file, 'r') as file :
  get_sun_direction = file.read()

# add prefix
shader = f"""
uniform vec4 fogSettings;
uniform vec4 AmbientColor;
uniform float time;

""" + shader

# getSunDirection
if re.findall( process_for_regex(config['sun']), shader ) :
  shader = get_sun_direction + '\n' + shader
  shader = re.sub( r"void\s?main\(\)\s?\{\n", "void main() {\n  vec3 sun = getSunDirection(cameraPosition);", shader )

# replace
shader = re.sub( process_for_regex(config['sun']), "sun", shader )
shader = re.sub( r"cb2\[14\]", "AmbientColor", shader )
shader = re.sub( r"cb2\[21\]", "fogSettings", shader )
shader = re.sub( r"\s*uniform samplerCube s\d;", "", shader )
shader = re.sub( r"\s*uniform vec4 cb2\[\d+\];", "", shader )
shader = re.sub( r"\s*r\d+ = g2l\(textureCubeLod\(s\d, r\d+.xyz, r\d+.w\)\);\n", "", shader )
shader = re.sub( r"mix\(cb2\[\d+\].xyz, r\d+.xyz, r\d+.yyy\)", "vec3(0)", shader )
shader = re.sub( r"gl_FragData\[0\]", "gl_FragColor", shader )
shader = re.sub( r"    ", "  ", shader )
if config['time'] :
  shader = re.sub( process_for_regex(config['time']) + r".[xyzw]+", "time", shader )

# replace settings
for i in config['settings'] :
  _shader = re.sub( r"cb7\[" + i + r"\]", config['settings'][i], shader )
  if _shader != shader :
    shader = f"uniform vec4 {config['settings'][i]};\n" + _shader
shader = re.sub( r"uniform vec4 cb7\[\d+\];\n", "", shader )

# replace textures
for i in config['textures'] :
  shader = re.sub( i, config['textures'][i], shader )

  
  # handle ground scattering textures
  if config['textures'][i] == 'GroundScattering1' or config['textures'][i] == 'GroundScattering2' :
    [ texture ] = re.findall( r"texture2D\(" + config['textures'][i] + r",\s?r\d+.[xyzw][xyzw]\)", shader )
    [ value ] = re.findall( r"r\d+", texture )
    [ keys ] = re.findall( r"[xyzw][xyzw]", texture )
    shader = re.sub(
      r"texture2D\(" + config['textures'][i] + r",\s?r\d+.[xyzw][xyzw]\)",
      f"texture2D({config['textures'][i]}, vec2({value}.{keys[0]}, 1.0-{value}.{keys[1]}))",
      shader
    )

# write out new shader
with open(output_file, 'w') as file :
  file.write(shader)