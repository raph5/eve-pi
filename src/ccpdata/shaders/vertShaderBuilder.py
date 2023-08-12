"""
Un joli petit script pour convertir les vertex shaders ccpwgl en shaders pour eve-pi
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
config_file = sys.argv[3] if len(sys.argv) > 3 else './vertShaderBuilder.json'
sun_direction_file = sys.argv[3] if len(sys.argv) > 3 else '../../lib/planets/shaders/getSunDirection.glsl'

# open json raw ccpwgl shader and config file
with open(input_file, 'r') as file :
  shader = file.read()
with open(config_file, 'r') as file :
  config = json.load(file)
with open(sun_direction_file, 'r') as file :
  get_sun_direction = file.read()

# add prefix
shader = f"""
uniform vec4 fogFactors;

""" + shader

# getSunDirection
if re.findall( process_for_regex(config['sun']), shader ) :
  shader = get_sun_direction + '\n' + shader
  shader = re.sub( r"void\s?main\(\)\s?\{\n", "void main() {\n  vec3 sun = getSunDirection(cameraPosition);", shader )

# replace
p1 = r"\s*gl_Position.x\s?=\s?dot\(r\d,\s?cb1\[4\]\);\n\s*gl_Position.y\s?=\s?dot\(r\d,\s?cb1\[5\]\);\n\s*gl_Position.z\s?=\s?dot\(r\d,\s?cb1\[6\]\);\n\s*gl_Position.w\s?=\s?dot\(r\d,\s?cb1\[7\]\);"
p2 = r"\s*gl_Position.xy\s?\+=\s?ssyf.xy\*gl_Position.w;\n\s*gl_Position.y\s?\*=\s?ssyf.z;\n\s*gl_Position.z\s?=\s?gl_Position.z\*2.0-gl_Position.w;"
shader = re.sub( r"    ", "  ", shader )
shader = re.sub( r"\s*uniform vec4 cb0\[\d+\];", "", shader )
shader = re.sub( r"\s*uniform vec4 cb1\[\d+\];", "", shader )
shader = re.sub( r"\s*uniform vec4 cb5\[\d+\];", "", shader )
shader = re.sub( r"cb1\[30\]", "fogFactors", shader )
shader = re.sub( process_for_regex(config['sun']), "sun", shader )
shader = re.sub( r"cb1\[3\]", "cameraPosition", shader )
shader = re.sub( r"cb0\[0\].xyz", "vec3(1)", shader )
shader = re.sub( r"cb5", "modelMatrix", shader )
shader = re.sub( p1, f"\n  gl_Position = projectionMatrix * modelViewMatrix * {config['pos']};", shader )
shader = re.sub( p2, "", shader )

# replace settings
if config.get('settings') :
  for i in config['settings'] :
    _shader = re.sub( r"cb0\[" + i + r"\]", config['settings'][i], shader )
    if _shader != shader :
      shader = f"uniform vec4 {config['settings'][i]};\n" + _shader
  shader = re.sub( r"uniform vec4 cb0\[\d+\];\n", "", shader )

# write out new shader
with open(output_file, 'w') as file :
  file.write(shader)