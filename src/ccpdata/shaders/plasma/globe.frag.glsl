uniform vec4 AnimationFactors;
uniform vec4 Parameters2;
uniform vec4 Parameters1;
uniform vec4 LavaSpecular;
uniform vec4 High;
uniform vec4 Mid;
uniform vec4 Low;
uniform vec4 LavaColor2;
uniform vec4 LavaColor1;
uniform vec4 MiscFactors;
uniform vec4 DetailFactors;

vec3 getSunDirection(vec3 cameraPosition) {

  vec3 rotationAxis = cameraPosition;
  rotationAxis.y = rotationAxis.x;
  rotationAxis.x = rotationAxis.z;
  rotationAxis.z = -rotationAxis.y;
  rotationAxis.y = 0.0;
  rotationAxis = normalize(rotationAxis);
  rotationAxis.y = 0.5;
  rotationAxis = normalize(rotationAxis);
  
  float sinA = -0.52268;
  float cosA = 0.85252;
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
#ifdef GL_OES_texture_3D
  #extension GL_OES_texture_3D: enable
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
#if !defined(GL_ES)||defined(GL_OES_texture_3D)
  #define tex3D(s, uvw, sl, su, sw, lw, l) texture3D(s, uvw, l)
  #ifdef GL_EXT_shader_texture_lod
    #define tex3DLod(s, uvw, l, sl, su, sw, lw) texture3DLod(s, uvw, l)
  #else
    #define tex3DLod(s, uvw, l, sl, su, sw, lw) texture3D(s, uvw)
  #endif
#else
  #define sampler3D sampler2D
  vec4 tex3D(sampler2D s, vec3 uvw, float sl, bool su, bool sw, bool lw, float l) {
    float y;
    if(su) y = fract(uvw.y);
    else y = clamp(uvw.y, 0.0, 1.0);
    y /= sl;
    float z, s0, s1;
    z = uvw.z*sl;
    s0 = floor(z);
    s1 = s0+1.0;
    if(!sw) {
      s0 = clamp(s0, 0.0, sl-1.0);
      s1 = clamp(s0, 0.0, sl-1.0);
    }
    s0 /= sl;
    s1 /= sl;
    z = fract(z);
    vec4 c0 = texture2D(s, vec2(uvw.x, y+s0));
    vec4 c1 = texture2D(s, vec2(uvw.x, y+s1));
    if(lw) return mix(c0, c1, z);
    return z<0.5?c0:c1;
  }
  #ifndef tex3DLod
    vec4 tex3DLod(sampler2D s, vec3 uvw, float l, float sl, bool su, bool sw, bool lw) {
      float y;
      if(su) y = fract(uvw.y);
      else y = clamp(uvw.y, 0.0, 1.0);
      y /= sl;
      float z, s0, s1;
      z = uvw.z*sl;
      s0 = floor(z);
      s1 = s0+1.0;
      if(!sw) {
        s0 = clamp(s0, 0.0, sl-1.0);
        s1 = clamp(s0, 0.0, sl-1.0);
      }
      s0 /= sl;
      s1 /= sl;
      z = fract(z);
      vec4 c0 = texture2DLod(s, vec2(uvw.x, y+s0), l);
      vec4 c1 = texture2DLod(s, vec2(uvw.x, y+s1), l);
      if(lw) return mix(c0, c1, z);
      return z<0.5?c0:c1;
    }
  #endif
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
uniform sampler3D Lava3DNoiseMap;
#ifndef GL_OES_texture_3D
  uniform float s7sl;
#else
  #define s7sl 0.0
#endif
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
  vec4 r6;
  vec4 c12 = vec4(0.159999996, 1, 0.5, 0.25);
  vec4 c13 = vec4(2, -1, 1, 0.270000011);
  vec4 c14 = vec4(0.649999976, 6, 5, 1);
  vec4 c15 = vec4(1, 0, 2, 0.5);
  vec4 c16 = vec4(0.100000001, -2, 3, -0.0404499359);
  vec4 c17 = vec4(0.0773993805, 0.0549999997, 0.947867274, 2.4000001);
  vec4 c18 = vec4(-0.00313080009, 12.9200001, 0.416666657, 0);
  vec4 c19 = vec4(1.05499995, -0.0549999997, 0, 0);
  v0 = texcoord;
  v1 = texcoord1;
  v2 = texcoord2;
  v3 = texcoord3;
  v4 = texcoord4;
  v5 = texcoord6;
  v6 = texcoord7;
  v7 = color;
  v8 = color1;
  r0 = AnimationFactors.yyyy*v0.xyxy;
  r0 = r0.zwxy*c15.xwzx;
  r1.xy = r0.zw;
  r2.x = AnimationFactors.x;
  r1.z = r2.x*sun.x;
  r2 = tex3D(Lava3DNoiseMap, r1.xyz, s7sl, true, true, true, 0.0);
  r0.w = dot(c12.xxx, r2.xyz);
  r0.z = r1.z*c13.w;
  r2 = tex3D(Lava3DNoiseMap, r0.xyz, s7sl, true, true, true, 0.0);
  r1.w = dot(c12.xxx, r2.xyz);
  r0.w = r0.w+r1.w;
  r1.w = pow(abs(r0.w), AnimationFactors.z);
  r2 = c15.wxwx*v0.zwzw;
  r3 = r2*AnimationFactors.yyyy;
  r2 = texture2D(heightMap2, r2.zw);
  r3 = r3*c12.yzzw;
  r0.xy = r3.zw;
  r1.xy = r3.xy;
  r3 = tex3D(Lava3DNoiseMap, r1.xyz, s7sl, true, true, true, 0.0);
  r0.w = dot(c12.xxx, r3.xyz);
  r3 = tex3D(Lava3DNoiseMap, r0.xyz, s7sl, true, true, true, 0.0);
  r0.x = dot(c12.xxx, r3.xyz);
  r0.x = r0.x+r0.w;
  r1.x = pow(abs(r0.x), AnimationFactors.z);
  r0 = texture2D(PolesGradient, v0.xy);
  r0.x = (-r0.x)+c15.x;
  r0.y = r0.x*r0.x;
  r0.x = saturate(dot(r0.xx, r0.yy)+c15.y);
  r3.x = saturate(mix(r1.w, r1.x, r0.x));
  r1.xyz = c15.xyz;
  r4 = DetailFactors.xxxx*r1.xyyx+r1.yxzy;
  r0.yz = r4.xy*v0.xy;
  r0.yz = r4.zw*r0.yz;
  r4 = texture2D(FillTexture, r0.yz);
  r0.yz = DetailFactors.xx*v0.zw;
  r0.yz = r0.yz*c15.ww;
  r5 = texture2D(FillTexture, r0.yz);
  r1.yz = mix(r4.yw, r5.yw, r0.xx);
  r0.y = r1.z*DetailFactors.y;
  r1.z = pow(abs(r0.y), AnimationFactors.z);
  r0.z = r3.x*r1.z;
  r0.z = r0.z*AnimationFactors.w;
  r0.w = r0.y*c14.y;
  r0.y = r0.y+r0.y;
  r3.xyz = r0.yyy*LavaColor2.xyz;
  r0.y = r0.w*r0.w;
  r4.xyz = r0.yyy*LavaColor1.xyz;
  r0.yzw = r4.xyz*r0.zzz+r3.xyz;
  r3 = texture2D(heightMap1, v0.xy);
  r1.z = r3.w*r3.z;
  r3.xy = r3.xy*c13.xx+c13.yy;
  r1.w = r2.z*r2.w+(-r1.z);
  r2.xy = r2.xy*c13.xx+c13.yy;
  r1.z = r0.x*r1.w+r1.z;
  r1.w = r1.z+Parameters1.x;
  r4.x = c16.x;
  r1.z = LavaSpecular.w*(-r4.x)+r1.z;
  r2.z = r1.w*Parameters1.y+(-Parameters1.z);
  r2.w = 1.0/Parameters1.w;
  r3.z = r2.w*r2.z;
  r2.z = saturate(r2.z*r2.w+(-c15.x));
  r3.z = saturate(r3.z);
  r5.xyz = Low.xyz;
  r4.yzw = (-r5.xyz)+Mid.xyz;
  r4.yzw = r3.zzz*r4.yzw+Low.xyz;
  r5.xyz = mix(r4.yzw, High.xyz, r2.zzz);
  r4.yzw = r1.yyy+r5.xyz;
  r1.y = Parameters1.y;
  r1.y = r1.w*r1.y+c14.x;
  r1.x = saturate(r1.w*(-Parameters1.y)+r1.x);
  r1.y = saturate(r1.y*c15.w);
  r1.y = (-r1.y)+c15.x;
  r1.y = saturate(r1.y*Parameters2.x+r1.x);
  r5.xyz = r0.yzw*r1.yyy+(-r4.yzw);
  r4.yzw = r1.xxx*r5.xyz+r4.yzw;
  r1.x = dot(r3.xy, (-r3.xy))+c15.x;
  r3.xy = r3.xy*MiscFactors.yy;
  r2.z = max(r1.x, c15.y);
  r1.x = r2.z == 0.0?3.402823466e+38:inversesqrt(abs(r2.z));
  r3.z = 1.0/r1.x;
  r5.xyz = normalize(r3.xyz);
  r3.xyz = r5.yyy*(-v3.xyz);
  r3.xyz = r5.xxx*(-v2.xyz)+r3.xyz;
  r3.xyz = r5.zzz*v1.xyz+r3.xyz;
  r1.x = dot(r2.xy, (-r2.xy))+c15.x;
  r2.xy = r2.xy*MiscFactors.yy;
  r2.w = max(r1.x, c15.y);
  r1.x = r2.w == 0.0?3.402823466e+38:inversesqrt(abs(r2.w));
  r2.z = 1.0/r1.x;
  r5.xyz = normalize(r2.xyz);
  r1.xw = r5.yx*c13.zy; {
    bvec2 tmp = greaterThanEqual(v1.yy, vec2(0.0));
    r1.xw = vec2(tmp.x?r5.x:r1.x, tmp.y?r5.y:r1.w);
  };
  r2.xyz = c13.zyz*v1.xzy;
  r2.xyz = r1.www*r2.xyz;
  r5.xyw = c13.zyz*v1.yxz;
  r2.xyz = r1.xxx*r5.xyw+r2.xyz;
  r2.xyz = r5.zzz*v1.xyz+r2.xyz;
  r5.xyz = mix(r3.xyz, r2.xyz, r0.xxx);
  r2.xyz = normalize(r5.xyz);
  r0.x = clamp(dot(r2.xyz, v5.xyz), 0.0, 1.0);
  r0.x = r1.y*(-c14.z)+r0.x;
  r3.xyz = saturate(r0.xxx*r4.yzw);
  r4.yzw = r4.yzw*AmbientColor.xyz;
  r0.x = r1.y*(-c14.z)+c14.w;
  r1.x = max(r0.x, c15.y);
  r4.yzw = r1.xxx*r4.yzw;
  r5.xyz = v1.xyz;
  r0.x = dot(r5.xyz, v5.xyz);
  r6.x = r0.x*c15.w+c15.w;
  r6.y = dot(r5.xyz, v6.xyz);
  r5 = texture2D(GroundScattering1, vec2(r6.x, 1.0-r6.y));
  r6 = texture2D(GroundScattering2, vec2(r6.x, 1.0-r6.y));
  r5.xyz = r5.xyz*v7.xyz;
  r3.xyz = r5.xyz*r3.xyz+r4.yzw;
  r0.xyz = r0.yzw*r1.yyy+r3.xyz;
  r0.xyz = v8.xyz*r6.xyz+r0.xyz;
  r0.w = r4.x*LavaSpecular.w;
  r0.w = LavaSpecular.z*r4.x+(-r0.w);
  r0.w = 1.0/r0.w;
  r0.w = saturate(r0.w*r1.z);
  r1.x = r0.w*c16.y+c16.z;
  r0.w = r0.w*r0.w;
  r0.w = r1.x*(-r0.w)+c15.x;
  r0.w = r0.w*LavaSpecular.x;
  r1.xyz = v5.xyz;
  r1.xyz = r1.xyz+v6.xyz;
  r3.xyz = normalize(r1.xyz);
  r1.x = clamp(dot(r2.xyz, r3.xyz), 0.0, 1.0);
  r2.x = pow(r1.x, LavaSpecular.y);
  r0.w = r0.w*r2.x;
  r0.xyz = r0.www*r5.xyz+r0.xyz;
  r1.xyz = r0.xyz+c16.www;
  r2.xyz = r0.xyz*c17.xxx;
  r0.xyz = r0.xyz+c17.yyy;
  r0.xyz = r0.xyz*c17.zzz;
  r3.x = abs(r0.x)>0.0?log2(abs(r0.x)):-3.402823466e+38;
  r3.y = abs(r0.y)>0.0?log2(abs(r0.y)):-3.402823466e+38;
  r3.z = abs(r0.z)>0.0?log2(abs(r0.z)):-3.402823466e+38;
  r0.xyz = r3.xyz*c17.www;
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
  r1.xyz = max(r0.xyz, c15.yyy);
  r0.x = r1.x>0.0?log2(r1.x):-3.402823466e+38;
  r0.y = r1.y>0.0?log2(r1.y):-3.402823466e+38;
  r0.z = r1.z>0.0?log2(r1.z):-3.402823466e+38;
  r0.xyz = r0.xyz*fogSettings.www;
  r1.xyz = r0.xyz*c18.zzz;
  r2.x = exp2(r1.x);
  r2.y = exp2(r1.y);
  r2.z = exp2(r1.z);
  r1.xyz = r2.xyz*c19.xxx+c19.yyy;
  r2.x = exp2(r0.x);
  r2.y = exp2(r0.y);
  r2.z = exp2(r0.z);
  r0.xyz = r2.xyz+c18.xxx;
  r2.xyz = r2.xyz*c18.yyy; {
    bvec3 tmp = greaterThanEqual(r0.xyz, vec3(0.0));
    gl_FragColor.xyz = vec3(tmp.x?r1.x:r2.x, tmp.y?r1.y:r2.y, tmp.z?r1.z:r2.z);
  };
  gl_FragColor.w = c15.x;
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
