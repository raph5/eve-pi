uniform vec4 Alpha;
uniform vec4 RingsFactors;
uniform vec4 CapColor;
uniform vec4 ringColor3;
uniform vec4 ringColor2;
uniform vec4 ringColor1;
uniform vec4 Saturation;
uniform vec4 BandingSpeed;
uniform vec4 FuzzyEdges;
uniform vec4 DistoFactors;
uniform vec4 WindFactors;

vec3 getSunDirection(vec3 cameraPosition) {

  vec3 rotationAxis = cameraPosition;
  rotationAxis.y = rotationAxis.x;
  rotationAxis.x = rotationAxis.z;
  rotationAxis.z = -rotationAxis.y;
  rotationAxis.y = 0.0;
  rotationAxis = normalize(rotationAxis);
  rotationAxis.y = 0.5;
  rotationAxis = normalize(rotationAxis);
  
  float angle = -0.44 - 0.02 * length(cameraPosition);
  float sinA = sin(angle);
  float cosA = cos(angle);
  vec4 quat = vec4(
  rotationAxis.x * sinA,
  rotationAxis.y * sinA,
  rotationAxis.z * sinA,
  cosA
  );
  quat = normalize(quat);

  float xx = quat.x * quat.x;
  float xy = quat.x * quat.y;
  float xz = quat.x * quat.z;
  float xw = quat.x * quat.w;
  float yy = quat.y * quat.y;
  float yz = quat.y * quat.z;
  float yw = quat.y * quat.w;
  float zz = quat.z * quat.z;
  float zw = quat.z * quat.w;
  mat3 rotationMatrix = mat3(
  1.0 - 2.0 * ( yy + zz ),
  2.0 * ( xy - zw ),
  2.0 * ( xz + yw ),
  2.0 * ( xy + zw ),
  1.0 - 2.0 * ( xx + zz ),
  2.0 * ( yz - xw ),
  2.0 * ( xz - yw ),
  2.0 * ( yz + xw ),
  1.0 - 2.0 * ( xx + yy )
  );

  return normalize(cameraPosition * rotationMatrix);

}


uniform vec4 fogSettings;
uniform vec4 AmbientColor;
uniform float time;

#if defined(GL_EXT_shader_texture_lod)
  #extension GL_EXT_shader_texture_lod: enable
  #define texture2DLod texture2DLodEXT
  #define texture2DProjLod texture2DProjLodEXT
  #define textureCubeLod textureCubeLodEXT
  #define texture2DGrad texture2DGradEXT
  #define texture2DProjGrad texture2DProjGradEXT
  #define textureCubeGrad textureCubeGradEXT
  #elif defined(EXT_shader_texture_lod)
  #extension EXT_shader_texture_lod: enable
  #define texture2DLod texture2DLodEXT
  #define texture2DProjLod texture2DProjLodEXT
  #define textureCubeLod textureCubeLodEXT
  #define texture2DGrad texture2DGradEXT
  #define texture2DProjGrad texture2DProjGradEXT
  #define textureCubeGrad textureCubeGradEXT
  #elif defined(GL_ARB_shader_texture_lod)
  #extension GL_ARB_shader_texture_lod: enable
  #define texture2DGrad texture2DGradARB
#endif
#ifdef GL_ES
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif
#endif
#if defined(GL_ES)&&!defined(GL_EXT_shader_texture_lod)&&!defined(EXT_shader_texture_lod)
  #define texture2DLod(s, u, l) texture2D(s, u)
  #define textureCubeLod(s, u, l) textureCube(s, u)
  #define texture2DGrad(s, u, x, y) texture2D(s, u)
  #define textureCubeGrad(s, u, x, y) textureCube(s, u)
#endif
vec4 g2l(vec4 x) {
  return vec4(pow(x.xyz, vec3(2.2)), x.w);
}
varying vec4 texcoord;
varying vec4 texcoord1;
varying vec4 texcoord2;
varying vec4 texcoord4;
uniform sampler2D heightMap1;
uniform sampler2D NoiseMap;
uniform sampler2D DistortionMap;
uniform sampler2D PolesMaskMap;
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
#ifdef PS
  uniform vec4 ssi;
  varying float ssv;
#endif
void main() {
  vec3 sun = getSunDirection(cameraPosition);  vec4 v0;
  vec4 v1;
  vec4 v2;
  vec4 v3;
  vec4 r0;
  vec4 r1;
  vec4 r2;
  vec4 r3;
  vec4 r4;
  vec4 r5;
  vec4 r6;
  vec4 r7;
  vec4 r8;
  vec4 c12 = vec4(-0.5, 1, -1, 0);
  vec4 c13 = vec4(0.00499999989, 0, -0.00499999989, -0.00999999978);
  vec4 c14 = vec4(8, 4, 100, 50);
  vec4 c15 = vec4(0.0500000007, 0.0199999996, -0.0500000007, -0.0199999996);
  vec4 c16 = vec4(0.298999995, 0.587000012, 0.184, 0.0773993805);
  vec4 c17 = vec4(0.0549999997, 0.947867274, 2.4000001, -0.00313080009);
  vec4 c18 = vec4(12.9200001, 0.416666657, 1.05499995, -0.0549999997);
  vec4 c19 = vec4(0, -0.00999999978, 0.00999999978, -0.0404499359);
  vec4 c20 = vec4(0.00499999989, -0.00499999989, 1, 0.00999999978);
  v0 = texcoord;
  v1 = texcoord1;
  v2 = texcoord2;
  v3 = texcoord4;
  r0.xyz = normalize(v1.xyz);
  r0.w = dot(v3.xyz, r0.xyz);
  gl_FragColor.w = saturate(r0.w*FuzzyEdges.x);
  r0.w = dot(v2.xyz, (-sun.xyz));
  r0.w = 1.0/r0.w;
  r1.x = dot(v2.xyz, r0.xyz);
  r0.w = r0.w*(-r1.x);
  r1.xyz = (-sun.xyz)*r0.www+r0.xyz;
  r0.x = dot(sun.xyz, r0.xyz);
  r0.y = dot(r1.xyz, r1.xyz);
  r0.y = sqrt(abs(r0.y));
  r1.xyz = c12.xyz;
  r0.z = r1.y+RingsFactors.w;
  r0.y = (-r0.z)+r0.y;
  r0.z = (-r0.z)+RingsFactors.x;
  r0.z = 1.0/r0.z;
  r2.x = saturate(r0.z*r0.y);
  r2.yw = abs(c12.xw);
  r3 = vec4(0);
  r0.y = Alpha.x*(-r3.w)+r1.y;
  r0.y = (-r0.w) >= 0.0?r0.y:c12.y;
  r0.z = saturate(r0.x);
  r0.x = r0.x+c12.y;
  r0.x = r0.x*(-c12.x);
  r0.z = (-r0.z)+c12.y;
  r0.z = r0.z*(-r0.z)+c12.y;
  r0.x = r0.x*r0.z;
  r3.xyz = (-r1.xxx)*AmbientColor.xyz;
  r0.xyz = r0.yyy*r0.xxx+r3.xyz;
  r3 = texture2D(DistortionMap, v0.xy);
  r3.xyz = r3.xyw+c12.xxx;
  r1 = r3.xxyy*r1.yzyz+WindFactors.zzzz;
  r0.w = r3.z*DistoFactors.x;
  r3 = r1*WindFactors.wwww; {
    bvec4 tmp = greaterThanEqual(r1, vec4(0.0));
    r1 = vec4(tmp.x?r3.x:c12.w, tmp.y?r3.y:c12.w, tmp.z?r3.z:c12.w, tmp.w?r3.w:c12.w);
  };
  r2.y = WindFactors.y;
  r3.x = r2.y*time;
  r4 = r3.xxxx*c20;
  r5.y = r3.x >= 0.0?c12.y:c12.z;
  r2.z = r4.x*r5.y;
  r2.xy = fract(r2.zw);
  r6 = r3.xxxx*c13.xyzy; {
    bvec4 tmp = greaterThanEqual(r6, vec4(0.0));
    r6 = vec4(tmp.x?c12.y:c12.z, tmp.y?c12.y:c12.z, tmp.z?c12.y:c12.z, tmp.w?c12.y:c12.z);
  };
  r7 = c14*v0.xyxy;
  r2.xy = r6.xy*r2.xy+r7.xy;
  r2 = texture2D(NoiseMap, r2.xy);
  r8.yz = c12.ww;
  r8.w = (-r3.x) >= 0.0?c12.y:c12.z;
  r8.x = r4.y*r8.w;
  r2.zw = fract(r8.xy);
  r2.zw = r6.zw*r2.zw+r7.xy;
  r6 = texture2D(NoiseMap, r2.zw);
  r2.y = r6.x;
  r2.y = dot(r2.xy, r1.zw)+c12.w;
  r3.w = r3.x*c13.w;
  r3.yzw = r3.xwx*r8.zww;
  r1.zw = fract(r3.yz);
  r2.zw = r3.ww*c15.zw;
  r2.zw = fract(r2.zw);
  r2.zw = r8.ww*r2.zw+r7.zw;
  r6 = texture2D(NoiseMap, r2.zw);
  r4.y = r6.x;
  r6 = r3.xxxx*c19.xyxz; {
    bvec4 tmp = greaterThanEqual(r6, vec4(0.0));
    r6 = vec4(tmp.x?c12.y:c12.z, tmp.y?c12.y:c12.z, tmp.z?c12.y:c12.z, tmp.w?c12.y:c12.z);
  };
  r1.zw = r6.xy*r1.zw+r7.xy;
  r8 = texture2D(NoiseMap, r1.zw);
  r5.xw = c12.ww;
  r1.zw = r4.zw*r5.xy;
  r1.zw = fract(r1.zw);
  r1.zw = r6.zw*r1.zw+r7.xy;
  r6 = texture2D(NoiseMap, r1.zw);
  r8.y = r6.x;
  r2.x = dot(r8.xy, r1.xy)+c12.w;
  r1.x = r3.x*r5.y;
  r1.y = r3.x*BandingSpeed.x;
  r1.xz = r1.xx*c15.xy;
  r1.xz = fract(r1.xz);
  r1.xz = r5.yy*r1.xz+r7.zw;
  r3 = texture2D(NoiseMap, r1.xz);
  r4.x = r3.x;
  r1.xz = r4.xy*(-c13.wz)+r2.xy;
  r1.xz = r1.xz*WindFactors.xx+r0.ww;
  r2 = texture2D(PolesMaskMap, v0.xy);
  r1.xw = r1.xz*r2.xx+v0.xy;
  r3.y = r1.z*(-c12.x);
  r0.w = (-r2.x)+c12.y;
  r1.z = r1.y >= 0.0?c12.y:c12.z;
  r1.y = r1.z*r1.y;
  r1.y = fract(r1.y);
  r5.z = r1.y*r1.z;
  r1.yz = r5.zw+r1.xw;
  r1.xw = (-r5.zw)+r1.xw;
  r2 = texture2D(heightMap1, r1.xw);
  r1 = texture2D(heightMap1, r1.yz);
  r2.xyz = r2.yyy*ringColor2.xyz;
  r1.xyw = r1.xxx*ringColor3.xyz+r2.xyz;
  r1.xyz = r1.zzz*ringColor1.xyz+r1.xyw;
  r2.xyz = r2.www*r1.xyz;
  r1.w = dot(r2.xyz, c16.xyz);
  r1.xyz = r1.xyz*r2.www+(-r1.www);
  r3.x = c12.w;
  r2.xy = r3.xy+v0.xy;
  r2 = texture2D(heightMap1, r2.xy);
  r2.x = r2.x*Saturation.x;
  r1.xyz = r2.xxx*r1.xyz+r1.www;
  r2.xyz = (-r1.xyz)+CapColor.xyz;
  r1.xyz = r0.www*r2.xyz+r1.xyz;
  r2.xyz = r0.xyz*r1.xyz;
  r2.xyz = r2.xyz*c16.www;
  r3.xyz = r1.xyz*r0.xyz+c19.www;
  r0.xyz = r1.xyz*r0.xyz+c17.xxx;
  r0.xyz = r0.xyz*c17.yyy;
  r1.x = abs(r0.x)>0.0?log2(abs(r0.x)):-3.402823466e+38;
  r1.y = abs(r0.y)>0.0?log2(abs(r0.y)):-3.402823466e+38;
  r1.z = abs(r0.z)>0.0?log2(abs(r0.z)):-3.402823466e+38;
  r0.xyz = r1.xyz*c17.zzz;
  r1.x = exp2(r0.x);
  r1.y = exp2(r0.y);
  r1.z = exp2(r0.z); {
    bvec3 tmp = greaterThanEqual(r3.xyz, vec3(0.0));
    r0.xyz = vec3(tmp.x?r1.x:r2.x, tmp.y?r1.y:r2.y, tmp.z?r1.z:r2.z);
  };
  r1.xyz = (-v3.xyz);
  r1.w = fogSettings.z;  r2.y = fogSettings.y;
  r3.xyz = vec3(0);
  r0.w = saturate(v3.w);
  r0.xyz = r0.www*r3.xyz+r0.xyz;
  r1.xyz = max(r0.xyz, c12.www);
  r0.x = r1.x>0.0?log2(r1.x):-3.402823466e+38;
  r0.y = r1.y>0.0?log2(r1.y):-3.402823466e+38;
  r0.z = r1.z>0.0?log2(r1.z):-3.402823466e+38;
  r0.xyz = r0.xyz*fogSettings.www;
  r1.xyz = r0.xyz*c18.yyy;
  r2.x = exp2(r1.x);
  r2.y = exp2(r1.y);
  r2.z = exp2(r1.z);
  r1.xyz = r2.xyz*c18.zzz+c18.www;
  r2.x = exp2(r0.x);
  r2.y = exp2(r0.y);
  r2.z = exp2(r0.z);
  r0.xyz = r2.xyz+c17.www;
  r2.xyz = r2.xyz*c18.xxx; {
    bvec3 tmp = greaterThanEqual(r0.xyz, vec3(0.0));
    gl_FragColor.xyz = vec3(tmp.x?r1.x:r2.x, tmp.y?r1.y:r2.y, tmp.z?r1.z:r2.z);
  };
  #ifdef PS
    float av = floor(clamp(gl_FragColor.a, 0.0, 1.0)*255.0+0.5);
    if(ssi.z == 0.0) {
      if(av*ssi.x+ssi.y<0.0)
      discard;
    }
    else {
      if(ssi.x>0.0) {
        if(av == ssi.y)
        discard;
      }
      else {
        if(av! = ssi.y)
        discard;
      }
  
    }
    if(ssv<0.0)discard;
  #endif
}
