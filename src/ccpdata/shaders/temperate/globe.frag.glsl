uniform vec4 CloudsFactors;
uniform vec4 CoverageFactors;
uniform vec4 CityLightColor;
uniform vec4 mountainTint;
uniform vec4 EquatorTint;
uniform vec4 VegetationTint;
uniform vec4 FillTint;
uniform vec4 SharpnessFactors;
uniform vec4 shallowWaterColor;
uniform vec4 WaterColor;
uniform vec4 MiscFactors;
uniform vec4 DetailFactors;

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
uniform sampler2D FillTexture;
uniform sampler2D heightMap1;
uniform sampler2D heightMap2;
uniform sampler2D GroundScattering1;
uniform sampler2D GroundScattering2;
uniform sampler2D CityLight;
uniform sampler2D CloudsTexture;
uniform sampler2D CityDistributionTexture;
uniform sampler2D PolesGradient0;
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
  vec4 c13 = vec4(0.5, 0.00999999978, 2, -1);
  vec4 c14 = vec4(10, -1, 1, -1000);
  vec4 c15 = vec4(50, 0.800000012, 0.300000012, -0.00350000011);
  vec4 c16 = vec4(0.000277777785, 0, -0.0404499359, 0.0773993805);
  vec4 c17 = vec4(0.0549999997, 0.947867274, 2.4000001, -0.00313080009);
  vec4 c18 = vec4(12.9200001, 0.416666657, 1.05499995, -0.0549999997);
  vec4 c19 = vec4(4, 1, 0, 2);
  v0 = texcoord;
  v1 = texcoord4;
  v2 = texcoord6;
  v3 = texcoord7;
  r0 = texture2D(heightMap1, v0.xy);
  r0.xy = r0.xy*c13.zz+c13.ww;
  r0.z = r0.z*r0.w+(-MiscFactors.x);
  r0.z = saturate(r0.z*c19.x);
  r0.w = dot(r0.xy, (-r0.xy))+c19.y;
  r1.xy = r0.xy*MiscFactors.yy;
  r1.w = max(r0.w, c19.z);
  r0.x = r1.w == 0.0?3.402823466e+38:inversesqrt(abs(r1.w));
  r1.z = 1.0/r0.x;
  r0.x = dot(r1.xyz, r1.xyz);
  r0.x = r0.x == 0.0?3.402823466e+38:inversesqrt(abs(r0.x));
  r2.xyz = r0.xxx*r1.xyz;
  r0.xyw = r1.xyz*(-r0.xxx)+c19.zzy;
  r1 = texture2D(PolesGradient, v0.xy);
  r1.x = (-r1.x)+c19.y;
  r2.w = pow(abs(r1.x), c14.x);
  r0.xyw = r2.www*r0.xyw+r2.xyz;
  r1.y = (-r0.w)+c19.y;
  r1.y = r1.y+r1.y;
  r1.z = r1.x*r1.x;
  r1.x = saturate(dot(r1.xx, r1.zz)+c19.z);
  r1.zw = c13.xx*v0.zw;
  r2 = texture2D(heightMap2, r1.zw);
  r1.zw = r1.zw*DetailFactors.xx;
  r3 = texture2D(FillTexture, r1.zw);
  r1.z = r2.z*r2.w+(-r0.z);
  r0.z = r1.x*r1.z+r0.z;
  r2.yzw = c19.yzw;
  r4 = DetailFactors.xxxx*r2.yzzy+r2.zywz;
  r1.zw = r4.xy*v0.xy;
  r1.zw = r4.zw*r1.zw;
  r4 = texture2D(FillTexture, r1.zw);
  r5 = mix(r4, r3, r1.xxxx);
  r1.x = r5.z*DetailFactors.y;
  r0.z = r1.x*c13.y+r0.z;
  r1.x = r0.z+(-MiscFactors.x);
  r1.z = (-r1.x)+CoverageFactors.y;
  r1.x = saturate(r1.x*c14.w);
  r1.y = saturate(SharpnessFactors.x*r1.z+(-r1.y));
  r2.xzw = r5.xxx*FillTint.xyz;
  r3.xyz = r5.yyy*VegetationTint.xyz+(-r2.xzw);
  r1.yzw = r1.yyy*r3.xyz+r2.xzw;
  r2.xzw = r5.zzz*EquatorTint.xyz+(-r1.yzw);
  r3.x = CoverageFactors.z+CoverageFactors.x;
  r3.x = (-r3.x)+c19.y;
  r3.x = r0.z+(-r3.x);
  r3.x = saturate(r3.x*SharpnessFactors.y);
  r1.yzw = r3.xxx*r2.xzw+r1.yzw;
  r2.xzw = r5.www*mountainTint.xyz+(-r1.yzw);
  r2.y = r2.y+(-CoverageFactors.z);
  r2.y = r0.z+(-r2.y);
  r0.z = r0.z+SharpnessFactors.w;
  r0.z = r0.z+(-MiscFactors.x);
  r0.z = saturate(r0.z*c15.x);
  r0.z = r0.z*c15.y;
  r3.x = r0.w*SharpnessFactors.z;
  r2.y = saturate(r2.y*r3.x);
  r1.yzw = r2.yyy*r2.xzw+r1.yzw;
  r2.x = dot(v2.xyz, v2.xyz);
  r2.x = r2.x == 0.0?3.402823466e+38:inversesqrt(abs(r2.x));
  r2.yzw = r2.xxx*v2.xyz;
  r3.xyz = r2.yzw*c14.yyz;
  r0.x = dot(r0.xyw, r3.xyz);
  r0.x = saturate(v2.z*r2.x+r0.x);
  r0.y = dot(v3.xyz, v3.xyz);
  r0.y = r0.y == 0.0?3.402823466e+38:inversesqrt(abs(r0.y));
  r3.yzw = r0.yyy*v3.xyz;
  r3.x = r2.w*c13.x+c13.x;
  r4 = texture2D(GroundScattering1, vec2(r3.x, 1.0-r3.w));
  r5 = texture2D(GroundScattering2, vec2(r3.x, 1.0-r3.w));
  r4.xyz = r4.xyz+AmbientColor.xyz;
  r6.xyz = r4.xyz*c13.xxx+r0.xxx;
  r1.yzw = r1.yzw*r6.xyz;
  r0.y = saturate(r3.w);
  r3.xyz = r3.www*(-c19.zzw)+r3.yzw;
  r0.w = clamp(dot(r2.yzw, (-r3.xyz)), 0.0, 1.0);
  r2.x = pow(r0.w, c14.x);
  r0.w = r2.x*c15.z;
  r0.y = (-r0.y)+c19.y;
  r2.x = r0.y*r0.y;
  r0.y = r0.y*r2.x;
  r2.x = r2.x*r2.x;
  r2.x = r2.x*r2.x;
  r0.x = r0.x*r2.x;
  r1.yzw = r1.yzw*r4.xyz+r0.xxx;
  r3.xyz = WaterColor.xyz;
  r3.xyz = (-r3.xyz)+shallowWaterColor.xyz;
  r3.xyz = r0.zzz*r3.xyz+WaterColor.xyz;
  r0.x = saturate(r2.w+r2.w);
  r0.xyz = r0.xxx*r0.yyy+r3.xyz;
  r0.xyz = r0.xyz*r4.xyz+r0.www;
  r3.xyz = mix(r1.yzw, r0.xyz, r1.xxx);
  r0.x = (-r1.x)+c19.y;
  r0.yzw = CloudsFactors.xxx*r5.xyz+(-r3.xyz);
  r1.xy = c16.xy;
  r1.xy = r1.xy*time;
  r1.xy = fract(r1.xy);
  r1.xy = r2.yz*c15.ww+r1.xy;
  r1.z = max((-r2.w), c19.z);
  r2.xy = CloudsFactors.ww*v0.xy;
  r1.xy = r2.xy*c19.wy+r1.xy;
  r2 = texture2D(CloudsTexture, r1.xy);
  r1.x = pow(abs(r2.x), CloudsFactors.z);
  r0.yzw = r1.xxx*r0.yzw+r3.xyz;
  r2 = texture2D(CityDistributionTexture, v0.xy);
  r2 = texture2D(CityLight, r2.xy);
  r3 = texture2D(PolesGradient0, v0.xy);
  r1.x = r2.x*r3.x;
  r1.y = 1.0/CoverageFactors.w;
  r2.x = pow(abs(r1.x), r1.y);
  r1.x = r1.z*r2.x;
  r1.xyz = r1.xxx*CityLightColor.xyz;
  r1.xyz = saturate(r0.xxx*r1.xyz);
  r0.xyz = r0.yzw+r1.xyz;
  r1.xyz = r0.xyz+c16.zzz;
  r2.xyz = r0.xyz*c16.www;
  r0.xyz = r0.xyz+c17.xxx;
  r0.xyz = r0.xyz*c17.yyy;
  r3.x = abs(r0.x)>0.0?log2(abs(r0.x)):-3.402823466e+38;
  r3.y = abs(r0.y)>0.0?log2(abs(r0.y)):-3.402823466e+38;
  r3.z = abs(r0.z)>0.0?log2(abs(r0.z)):-3.402823466e+38;
  r0.xyz = r3.xyz*c17.zzz;
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
  r1.xyz = max(r0.xyz, c19.zzz);
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
  gl_FragColor.w = c19.y;
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
