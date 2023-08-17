uniform vec4 CloudsFactors;
uniform vec4 CloudsColor;
uniform vec4 shallowWaterColor;
uniform vec4 WaterColor;

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
varying vec4 texcoord4;
varying vec4 texcoord6;
varying vec4 texcoord7;
uniform sampler2D PolesGradient;
uniform sampler2D heightMap;
uniform sampler2D GroundScattering1;
uniform sampler2D GroundScattering2;
uniform sampler2D CloudsTexture;
uniform sampler2D CloudCapTexture;
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
  vec4 r0;
  vec4 r1;
  vec4 r2;
  vec4 r3;
  vec4 r4;
  vec4 r5;
  vec4 r6;
  vec4 r7;
  vec4 c5 = vec4(1, 0, 0.5, 2);
  vec4 c6 = vec4(0.300000012, -0.0404499359, 0.0773993805, 0.0549999997);
  vec4 c7 = vec4(0.947867274, 2.4000001, -0.00313080009, 12.9200001);
  vec4 c8 = vec4(0.416666657, 1.05499995, -0.0549999997, 0);
  vec4 c9 = vec4(0.000277777785, 0, -0.00350000011, 10);
  v0 = texcoord;
  v1 = texcoord4;
  v2 = texcoord6;
  v3 = texcoord7;
  r0 = texture2D(PolesGradient, v0.xy);
  r0.x = (-r0.x)+c5.x;
  r0.y = r0.x*r0.x;
  r0.x = saturate(dot(r0.xx, r0.yy)+c5.y);
  r0.x = (-r0.x)+c5.x;
  r1 = texture2D(heightMap, v0.xy);
  r0.y = r1.w*r1.z;
  r0.yzw = r0.yyy*shallowWaterColor.xyz;
  r0.xyz = r0.yzw*r0.xxx+WaterColor.xyz;
  r0.w = dot(v3.xyz, v3.xyz);
  r0.w = r0.w == 0.0?3.402823466e+38:inversesqrt(abs(r0.w));
  r1.yzw = r0.www*v3.xyz;
  r0.w = saturate(r1.w);
  r0.w = (-r0.w)+c5.x;
  r2.x = r0.w*r0.w;
  r0.w = r0.w*r2.x;
  r2.xyz = normalize(v2.xyz);
  r2.w = saturate(r2.z+r2.z);
  r0.w = r0.w*r2.w;
  r1.x = r2.z*c5.z+c5.z;
  r3 = texture2D(GroundScattering1, vec2(r1.x, 1.0-r1.w));
  r4 = texture2D(GroundScattering2, vec2(r1.x, 1.0-r1.w));
  r1.xyz = r1.www*(-c5.yyw)+r1.yzw;
  r1.x = clamp(dot(r2.xyz, (-r1.xyz)), 0.0, 1.0);
  r2.z = pow(r1.x, c9.w);
  r1.xyz = r3.xyz+AmbientColor.xyz;
  r0.xyz = r0.xyz*r1.xyz+r0.www;
  r3.xyz = CloudsFactors.xxx*r4.xyz+(-r0.xyz);
  r5.xy = c9.xy;
  r5.xy = r5.xy*time;
  r5.xy = fract(r5.xy);
  r2.xy = r2.xy*c9.zz+r5.xy;
  r6 = CloudsFactors.wwww*v0;
  r2.xy = r6.xy*c5.wx+r2.xy;
  r7 = texture2D(CloudsTexture, r2.xy);
  r0.w = pow(abs(r7.x), CloudsFactors.z);
  r0.xyz = r0.www*r3.xyz+r0.xyz;
  r2.y = CloudsFactors.y;
  r2.xyw = r2.yyy*CloudsColor.xyz;
  r1.xyz = r2.xyw*r1.xyz+(-r0.xyz);
  r2.xy = r6.xy*c5.wx+r5.xy;
  r3 = texture2D(CloudCapTexture, r6.zw);
  r5 = texture2D(CloudsTexture, r2.xy);
  r0.w = max(r5.x, r3.x);
  r1.w = pow(abs(r0.w), CloudsFactors.z);
  r0.xyz = r1.www*r1.xyz+r0.xyz;
  r0.xyz = r2.zzz*c6.xxx+r0.xyz;
  r0.xyz = r4.xyz+r0.xyz;
  r1.xyz = r0.xyz+c6.yyy;
  r2.xyz = r0.xyz*c6.zzz;
  r0.xyz = r0.xyz+c6.www;
  r0.xyz = r0.xyz*c7.xxx;
  r3.x = abs(r0.x)>0.0?log2(abs(r0.x)):-3.402823466e+38;
  r3.y = abs(r0.y)>0.0?log2(abs(r0.y)):-3.402823466e+38;
  r3.z = abs(r0.z)>0.0?log2(abs(r0.z)):-3.402823466e+38;
  r0.xyz = r3.xyz*c7.yyy;
  r3.x = exp2(r0.x);
  r3.y = exp2(r0.y);
  r3.z = exp2(r0.z); {
    bvec3 tmp = greaterThanEqual(r1.xyz, vec3(0.0));
    r0.xyz = vec3(tmp.x?r3.x:r2.x, tmp.y?r3.y:r2.y, tmp.z?r3.z:r2.z);
  };
  r1.xyz = (-v1.xyz);
  r1.w = fogSettings.z;  r2.y = fogSettings.y;
  r3.xyz = vec3(0);
  r0.w = saturate(v1.w);
  r0.xyz = r0.www*r3.xyz+r0.xyz;
  r1.xyz = max(r0.xyz, c5.yyy);
  r0.x = r1.x>0.0?log2(r1.x):-3.402823466e+38;
  r0.y = r1.y>0.0?log2(r1.y):-3.402823466e+38;
  r0.z = r1.z>0.0?log2(r1.z):-3.402823466e+38;
  r0.xyz = r0.xyz*fogSettings.www;
  r1.xyz = r0.xyz*c8.xxx;
  r2.x = exp2(r1.x);
  r2.y = exp2(r1.y);
  r2.z = exp2(r1.z);
  r1.xyz = r2.xyz*c8.yyy+c8.zzz;
  r2.x = exp2(r0.x);
  r2.y = exp2(r0.y);
  r2.z = exp2(r0.z);
  r0.xyz = r2.xyz+c7.zzz;
  r2.xyz = r2.xyz*c7.www; {
    bvec3 tmp = greaterThanEqual(r0.xyz, vec3(0.0));
    gl_FragColor.xyz = vec3(tmp.x?r1.x:r2.x, tmp.y?r1.y:r2.y, tmp.z?r1.z:r2.z);
  };
  gl_FragColor.w = c5.x;
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
