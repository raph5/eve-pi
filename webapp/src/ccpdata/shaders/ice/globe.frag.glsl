uniform vec4 IceRampColorHigh;
uniform vec4 IceRampColorMiddle;
uniform vec4 IceRampColorLow;
uniform vec4 IceSpecular;
uniform vec4 IceDetail;
uniform vec4 IceFactors;
uniform vec4 MiscFactors;

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
varying vec4 texcoord3;
varying vec4 texcoord4;
varying vec4 texcoord6;
varying vec4 texcoord7;
varying vec4 color;
varying vec4 color1;
uniform sampler2D PolesGradient;
uniform sampler2D FillTexture;
uniform sampler2D heightMap1;
uniform sampler2D heightMap2;
uniform sampler2D GroundScattering1;
uniform sampler2D GroundScattering2;
uniform sampler2D ColorizeMap;
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
  vec4 v0;
  vec4 v1;
  vec4 v2;
  vec4 v3;
  vec4 v4;
  vec4 v5;
  vec4 v6;
  vec4 v7;
  vec4 v8;
  vec4 r0;
  vec4 r1;
  vec4 r2;
  vec4 r3;
  vec4 r4;
  vec4 r5;
  vec4 c7 = vec4(2, -1, 0.300000012, 1);
  vec4 c8 = vec4(-2, 3, -0.0404499359, 0.0773993805);
  vec4 c9 = vec4(0.0549999997, 0.947867274, 2.4000001, -0.00313080009);
  vec4 c10 = vec4(12.9200001, 0.416666657, 1.05499995, -0.0549999997);
  vec4 c11 = vec4(1, 0, 0.5, 2);
  v0 = texcoord;
  v1 = texcoord1;
  v2 = texcoord2;
  v3 = texcoord3;
  v4 = texcoord4;
  v5 = texcoord6;
  v6 = texcoord7;
  v7 = color;
  v8 = color1;
  r0.xy = c11.zx*v0.zw;
  r0 = texture2D(heightMap2, r0.xy);
  r0.xy = r0.xy*c7.xx+c7.yy;
  r1.x = dot(r0.xy, (-r0.xy))+c11.x;
  r2.xy = r0.xy*MiscFactors.yy;
  r0.x = max(r1.x, c11.y);
  r0.x = r0.x == 0.0?3.402823466e+38:inversesqrt(abs(r0.x));
  r2.z = 1.0/r0.x;
  r1.xyz = normalize(r2.xyz);
  r1.xyz = r1.xyz*c7.zzw;
  r2.xyz = normalize(r1.xyz);
  r0.xy = r2.yx*c7.wy; {
    bvec2 tmp = greaterThanEqual(v1.yy, vec2(0.0));
    r0.xy = vec2(tmp.x?r2.x:r0.x, tmp.y?r2.y:r0.y);
  };
  r1.xyz = c7.wyw*v1.xzy;
  r1.xyz = r0.yyy*r1.xyz;
  r2.xyw = c7.wyw*v1.yxz;
  r1.xyz = r0.xxx*r2.xyw+r1.xyz;
  r1.xyz = r2.zzz*v1.xyz+r1.xyz;
  r2 = texture2D(heightMap1, v0.xy);
  r0.xy = r2.xy*c7.xx+c7.yy;
  r1.w = r2.w*r2.z;
  r2.x = dot(r0.xy, (-r0.xy))+c11.x;
  r3.xy = r0.xy*MiscFactors.yy;
  r0.x = max(r2.x, c11.y);
  r0.x = r0.x == 0.0?3.402823466e+38:inversesqrt(abs(r0.x));
  r3.z = 1.0/r0.x;
  r2.xyz = normalize(r3.xyz);
  r2.xyz = r2.xyz*c7.zzw;
  r3.xyz = normalize(r2.xyz);
  r2.xyz = r3.yyy*(-v3.xyz);
  r2.xyz = r3.xxx*(-v2.xyz)+r2.xyz;
  r2.xyz = r3.zzz*v1.xyz+r2.xyz;
  r3 = texture2D(PolesGradient, v0.xy);
  r0.x = (-r3.x)+c11.x;
  r0.y = r0.x*r0.x;
  r0.x = saturate(dot(r0.xx, r0.yy)+c11.y);
  r3.xyz = mix(r2.xyz, r1.xyz, r0.xxx);
  r1.xyz = normalize(r3.xyz);
  r2.xyz = v5.xyz;
  r3.xyz = r2.xyz+v6.xyz;
  r4.xyz = normalize(r3.xyz);
  r0.y = clamp(dot(r1.xyz, r4.xyz), 0.0, 1.0);
  r1.x = dot(v5.xyz, r1.xyz);
  r1.y = pow(r0.y, IceSpecular.y);
  r0.y = r0.z*r0.w+(-r1.w);
  r0.y = r0.x*r0.y+r1.w;
  r0.z = r0.y+(-IceSpecular.w);
  r0.w = (-IceSpecular.w)+IceSpecular.z;
  r0.w = 1.0/r0.w;
  r0.z = saturate(r0.w*r0.z);
  r0.w = r0.z*c8.x+c8.y;
  r0.z = r0.z*r0.z;
  r0.z = r0.w*(-r0.z)+c11.x;
  r0.z = r0.z*IceSpecular.x;
  r0.z = r1.y*r0.z;
  r0.w = dot(v1.xyz, r2.xyz);
  r2.x = r0.w*c11.z+c11.z;
  r3.xyz = v1.xyz;
  r2.y = dot(r3.xyz, v6.xyz);
  r3 = texture2D(GroundScattering1, vec2(r2.x, 1.0-r2.y));
  r2 = texture2D(GroundScattering2, vec2(r2.x, 1.0-r2.y));
  r1.yzw = r3.xyz*v7.xyz;
  r1.yzw = r0.zzz*r1.yzw;
  r3 = IceDetail.yyyy*v0;
  r3 = r3*c11.wxzz;
  r4 = texture2D(FillTexture, r3.xy);
  r3 = texture2D(FillTexture, r3.zw);
  r2.w = mix(r4.x, r3.x, r0.x);
  r3 = IceDetail.zzzz*v0;
  r3 = r3*c11.wxzz;
  r4 = texture2D(FillTexture, r3.xy);
  r3 = texture2D(FillTexture, r3.zw);
  r5.x = mix(r4.y, r3.y, r0.x);
  r0.x = r2.w*r5.x;
  r0.x = sqrt(abs(r0.x));
  r0.x = r0.x+(-c11.z);
  r0.z = IceDetail.x+IceDetail.x;
  r0.x = r0.z*r0.x+r0.y;
  r3.x = IceDetail.x;
  r0.y = (-r3.x)+IceFactors.x;
  r0.x = (-r0.y)+r0.x;
  r0.z = r3.x+IceFactors.y;
  r0.y = (-r0.y)+r0.z;
  r0.y = 1.0/r0.y;
  r0.x = saturate(r0.y*r0.x);
  r0.y = 1.0/IceFactors.z;
  r0.z = r0.y*r0.x;
  r0.x = saturate(r0.x*r0.y+(-c11.x));
  r0.z = saturate(r0.z);
  r3.xyz = IceRampColorLow.xyz;
  r3.xyz = (-r3.xyz)+IceRampColorMiddle.xyz;
  r0.yzw = r0.zzz*r3.xyz+IceRampColorLow.xyz;
  r3.xyz = mix(r0.yzw, IceRampColorHigh.xyz, r0.xxx);
  r0 = texture2D(ColorizeMap, v0.xy);
  r0.xyz = r0.xyz*r3.xyz;
  r0.w = saturate(r1.x);
  r1.x = r1.x+c11.x;
  r1.x = r1.x*c11.z;
  r0.w = (-r0.w)+c11.x;
  r0.w = r0.w*(-r0.w)+c11.x;
  r3.z = c11.z;
  r3.xyz = r3.zzz*AmbientColor.xyz;
  r3.xyz = r0.www*r1.xxx+r3.xyz;
  r0.xyz = r0.xyz*r3.xyz+r1.yzw;
  r0.xyz = v8.xyz*r2.xyz+r0.xyz;
  r1.xyz = r0.xyz+c8.zzz;
  r2.xyz = r0.xyz*c8.www;
  r0.xyz = r0.xyz+c9.xxx;
  r0.xyz = r0.xyz*c9.yyy;
  r3.x = abs(r0.x)>0.0?log2(abs(r0.x)):-3.402823466e+38;
  r3.y = abs(r0.y)>0.0?log2(abs(r0.y)):-3.402823466e+38;
  r3.z = abs(r0.z)>0.0?log2(abs(r0.z)):-3.402823466e+38;
  r0.xyz = r3.xyz*c9.zzz;
  r3.x = exp2(r0.x);
  r3.y = exp2(r0.y);
  r3.z = exp2(r0.z); {
    bvec3 tmp = greaterThanEqual(r1.xyz, vec3(0.0));
    r0.xyz = vec3(tmp.x?r3.x:r2.x, tmp.y?r3.y:r2.y, tmp.z?r3.z:r2.z);
  };
  r1.xyz = (-v4.xyz);
  r1.w = fogSettings.z;  r2.y = fogSettings.y;
  r3.xyz = vec3(0);
  r0.w = saturate(v4.w);
  r0.xyz = r0.www*r3.xyz+r0.xyz;
  r1.xyz = max(r0.xyz, c11.yyy);
  r0.x = r1.x>0.0?log2(r1.x):-3.402823466e+38;
  r0.y = r1.y>0.0?log2(r1.y):-3.402823466e+38;
  r0.z = r1.z>0.0?log2(r1.z):-3.402823466e+38;
  r0.xyz = r0.xyz*fogSettings.www;
  r1.xyz = r0.xyz*c10.yyy;
  r2.x = exp2(r1.x);
  r2.y = exp2(r1.y);
  r2.z = exp2(r1.z);
  r1.xyz = r2.xyz*c10.zzz+c10.www;
  r2.x = exp2(r0.x);
  r2.y = exp2(r0.y);
  r2.z = exp2(r0.z);
  r0.xyz = r2.xyz+c9.www;
  r2.xyz = r2.xyz*c10.xxx; {
    bvec3 tmp = greaterThanEqual(r0.xyz, vec3(0.0));
    gl_FragColor.xyz = vec3(tmp.x?r1.x:r2.x, tmp.y?r1.y:r2.y, tmp.z?r1.z:r2.z);
  };
  gl_FragColor.w = c11.x;
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
