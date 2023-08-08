attribute vec4 attr0;
attribute vec4 attr1;
attribute vec4 attr2;
attribute vec4 attr3;
attribute vec4 attr4;
attribute vec4 attr5;
varying vec4 texcoord;
varying vec4 texcoord1;
varying vec4 texcoord2;
varying vec4 texcoord3;
varying vec4 texcoord4;
varying vec4 texcoord5;
varying vec4 texcoord6;
varying vec4 texcoord7;
varying vec4 color;
varying vec4 color1;

float saturate(float x) {
  return clamp(x, 0.0, 1.0);
}
vec2 saturate(vec2 x) {
  return clamp(x, vec2(0.0), vec2(1.0));
}
vec3 saturate(vec3 x) {
  return clamp(x, vec3(0.0), vec3(1.0));
}
vec4 saturate(vec4 x) {
  return clamp(x, vec4(0.0), vec4(1.0));
}


uniform vec3 fogFactors;


void main() {

  vec4 v0;
  vec4 v1;
  vec4 v2;
  vec4 v3;
  vec4 v4;
  vec4 v5;

  vec4 r0;
  vec4 r1;
  vec4 r2;
  vec4 r3;
  vec4 r4;
  vec4 r5;

  vec4 c1 = vec4(1, 0, 1000000, 0);

  v0 = attr0;
  v1 = attr1;
  v2 = attr2;
  v3 = attr3;
  v4 = attr4;
  v5 = attr5;

  r1.xyz = normalize(v3.xyz);
  r0.xyz = getSunDirection(cameraPosition);
  texcoord6.x = dot(r1.xyz, r0.xyz);

  r3.xyz = normalize(v4.xyz);
  texcoord6.y = dot(r3.xyz, r0.xyz);

  r4.xyz = normalize(v2.xyz);
  texcoord6.z = dot(r4.xyz, r0.xyz);

  r0 = v0.xyzx*c1.xxxy+c1.yyyx;
  r2.x = r0.x*10000.0;
  r2.y = r0.y*10000.0;
  r2.z = r0.z*10000.0;
  r2.w = r0.w;
  r0.xyz = (-r2.xyz) + normalize(cameraPosition)*60000.0;
  r0.w = dot(r0.xyz, r0.xyz);
  r0.w = r0.w == 0.0?3.402823466e+38:inversesqrt(abs(r0.w));
  r0.xyz = r0.www*r0.xyz;
  r0.w = 1.0/r0.w;
  r0.w = r0.w*fogFactors.y;
  r5.z = c1.z;
  r0.w = saturate(r0.w*(-r5.z)+fogFactors.x);


  // coordonées de texture
  texcoord4.w = r0.w*(-fogFactors.z)+fogFactors.z;
  texcoord7.x = dot(r1.xyz, r0.xyz);
  texcoord2.xyz = r1.xyz;
  texcoord7.y = dot(r3.xyz, r0.xyz);
  texcoord3.xyz = r3.xyz;
  texcoord7.z = dot(r4.xyz, r0.xyz);
  texcoord4.xyz = r0.xyz;
  texcoord1.xyz = r4.xyz;
  
  gl_Position = projectionMatrix * modelViewMatrix * v0;

  texcoord5.xyz = r2.xyz;
  texcoord.xy = v1.xy;
  texcoord.zw = v5.xy;
  texcoord6.w = c1.y;
  texcoord7.w = c1.y;
  color.xyz = vec3(1, 1, 1);
  color1.xyz = vec3(1, 1, 1);
}
