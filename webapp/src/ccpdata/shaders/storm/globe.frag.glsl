uniform vec4 Lightningfactors;
uniform vec4 LightningColor;
uniform vec4 CloudsFactors;
uniform vec4 CloudsColor;
uniform vec4 MagmaFactors2;
uniform vec4 MagmaFactors;
uniform vec4 PlanetColor;

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
varying vec4 texcoord4;
varying vec4 texcoord6;
varying vec4 texcoord7;
varying vec4 color1;
uniform sampler2D MaskMap;
uniform sampler2D GroundScattering1;
uniform sampler2D GroundScattering2;
uniform sampler2D CloudsTexture;
uniform sampler2D CloudCapTexture;
uniform sampler3D Lava3DNoiseMap;
#ifndef GL_OES_texture_3D
  uniform float s6sl;
#else
  #define s6sl 0.0
#endif
uniform sampler2D LightningMap;
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
  vec4 r0;
  vec4 r1;
  vec4 r2;
  vec4 r3;
  vec4 r4;
  vec4 r5;
  vec4 c8 = vec4(0.5, 1, 0, -1);
  vec4 c9 = vec4(1000, 0.00100000005, -1000, -0.00100000005);
  vec4 c10 = vec4(0.200000003, 0.833999991, 1.43884897, 6);
  vec4 c11 = vec4(-0.00999999978, -0.00499999989, 0.00999999978, 0.00499999989);
  vec4 c12 = vec4(6.28318548, -3.14159274, 100, 0.899999976);
  vec4 c13 = vec4(3, 10, 2.5, 0.699999988);
  vec4 c14 = vec4(2, 1, 0.0399999991, -0.0404499359);
  vec4 c15 = vec4(0.0773993805, 0.0549999997, 0.947867274, 2.4000001);
  vec4 c16 = vec4(-0.00313080009, 12.9200001, 0.416666657, 0);
  vec4 c17 = vec4(1.05499995, -0.0549999997, 0, 0);
  vec4 c18 = vec4(3.4777801, 0.345047712, 14.5023422, 0.082745254);
  vec4 c19 = vec4(0.000277777785, 0, 0.100000001, 0.5);
  v0 = texcoord;
  v1 = texcoord4;
  v2 = texcoord6;
  v3 = texcoord7;
  v4 = color1;
  r0.x = time;
  r0.y = r0.x*MagmaFactors.z; {
    bvec2 tmp = greaterThanEqual(r0.yy, vec2(0.0));
    r0.zw = vec2(tmp.x?c9.x:c9.z, tmp.y?c9.y:c9.w);
  };
  r0.y = r0.w*r0.y;
  r0.y = fract(r0.y);
  r0.y = r0.y*r0.z;
  r0.yzw = r0.yyy*c8.yzz;
  r1.yw = c8.yw;
  r1.xyz = r1.wyy*MagmaFactors.yyy;
  r2.xyz = r1.xyz*v4.xyz+r0.yzw;
  r1.xyz = r1.zzx*v4.xyz+r0.wyw;
  r0.yzw = MagmaFactors.yyy*v4.xyz+r0.wzy;
  r3.xyz = r2.xyz*c10.yyy;
  r3 = tex3D(Lava3DNoiseMap, r3.xyz, s6sl, true, true, true, 0.0);
  r3 = r3+(-c8.xxxx);
  r3 = r3*c10.zzzz;
  r4.xyz = r2.xyz*c10.xxx;
  r4 = tex3D(Lava3DNoiseMap, r4.xyz, s6sl, true, true, true, 0.0);
  r4 = r4+(-c8.xxxx);
  r3 = r4*c10.wwww+r3;
  r4.xyz = r2.xyz*c18.xxx;
  r2.xyz = r2.xyz*c18.zzz;
  r2 = tex3D(Lava3DNoiseMap, r2.xyz, s6sl, true, true, true, 0.0);
  r2 = r2+(-c8.xxxx);
  r4 = tex3D(Lava3DNoiseMap, r4.xyz, s6sl, true, true, true, 0.0);
  r4 = r4+(-c8.xxxx);
  r3 = r4*c18.yyyy+r3;
  r2 = r2*c18.wwww+r3;
  r2.xy = r2.zw+r2.xy;
  r3.xyz = r1.xyz*c10.yyy;
  r3 = tex3D(Lava3DNoiseMap, r3.xyz, s6sl, true, true, true, 0.0);
  r3 = r3+(-c8.xxxx);
  r3 = r3*c10.zzzz;
  r4.xyz = r1.xyz*c10.xxx;
  r4 = tex3D(Lava3DNoiseMap, r4.xyz, s6sl, true, true, true, 0.0);
  r4 = r4+(-c8.xxxx);
  r3 = r4*c10.wwww+r3;
  r4.xyz = r1.xyz*c18.xxx;
  r1.xyz = r1.xyz*c18.zzz;
  r1 = tex3D(Lava3DNoiseMap, r1.xyz, s6sl, true, true, true, 0.0);
  r1 = r1+(-c8.xxxx);
  r4 = tex3D(Lava3DNoiseMap, r4.xyz, s6sl, true, true, true, 0.0);
  r4 = r4+(-c8.xxxx);
  r3 = r4*c18.yyyy+r3;
  r1 = r1*c18.wwww+r3;
  r1.xy = r1.zw+r1.xy;
  r3.xyz = normalize(v4.xyz);
  r3.xyz = r3.xyz*r3.xyz;
  r3.xyz = r3.xyz*r3.xyz;
  r1.xy = r1.xy*r3.yy;
  r1.xy = r2.xy*r3.xx+r1.xy;
  r2.xyz = r0.yzw*c10.yyy;
  r2 = tex3D(Lava3DNoiseMap, r2.xyz, s6sl, true, true, true, 0.0);
  r2 = r2+(-c8.xxxx);
  r2 = r2*c10.zzzz;
  r3.xyw = r0.yzw*c10.xxx;
  r4 = tex3D(Lava3DNoiseMap, r3.xyw, s6sl, true, true, true, 0.0);
  r4 = r4+(-c8.xxxx);
  r2 = r4*c10.wwww+r2;
  r3.xyw = r0.yzw*c18.xxx;
  r0.yzw = r0.yzw*c18.zzz;
  r4 = tex3D(Lava3DNoiseMap, r0.yzw, s6sl, true, true, true, 0.0);
  r4 = r4+(-c8.xxxx);
  r5 = tex3D(Lava3DNoiseMap, r3.xyw, s6sl, true, true, true, 0.0);
  r5 = r5+(-c8.xxxx);
  r2 = r5*c18.yyyy+r2;
  r2 = r4*c18.wwww+r2;
  r0.yz = r2.zw+r2.xy;
  r0.yz = r0.yz*r3.zz+r1.xy;
  r1.x = abs(r0.y)>0.0?log2(abs(r0.y)):-3.402823466e+38;
  r1.y = abs(r0.z)>0.0?log2(abs(r0.z)):-3.402823466e+38;
  r0.yz = r1.xy*MagmaFactors2.xx;
  r1.xz = vec2(exp2(r0.y));
  r1.yw = vec2(exp2(r0.z));
  r1 = MagmaFactors.wwww*r1+v0;
  r2 = r1*CloudsFactors.wwww;
  r0.yz = r0.xx*c19.xy;
  r0.yz = fract(r0.yz);
  r0.yz = r2.xy*c14.xy+r0.yz;
  r2 = texture2D(CloudCapTexture, r2.zw);
  r3 = texture2D(CloudsTexture, r0.yz);
  r0.y = max(r3.x, r2.x);
  r1.z = pow(abs(r0.y), CloudsFactors.z);
  r0.y = r1.z+c11.z;
  r2 = r0.xxxx*c11;
  r2 = r1.xyxy*c13.xxyy+r2;
  r0.zw = r1.xy*c14.xy;
  r1 = texture2D(MaskMap, r2.xy);
  r2 = texture2D(MaskMap, r2.zw);
  r1.x = r1.x*r2.x;
  r2.x = pow(abs(r1.x), c13.z);
  r1.x = r0.x*c19.z+c19.w;
  r1.x = fract(r1.x);
  r1.x = r1.x*c12.x+c12.y;
  r3.y = sin(r1.x);
  r1.x = max(r3.y, c13.w);
  r1.x = r2.x*r1.x;
  r1.x = r1.x*c12.z;
  r1.y = r1.x*r1.x;
  r1.y = r1.y*r1.y;
  r1.x = r1.y*r1.x;
  r2 = r0.xxxx*Lightningfactors.xxyy;
  r3 = fract(r2.yyww);
  r2 = r2+(-r3);
  r2 = r2*c12.wwww+r0.zwzw;
  r0.xz = r0.xx*c14.xx+r0.zw;
  r3 = texture2D(MaskMap, r0.xz);
  r0.x = r3.x*c13.y;
  r3 = texture2D(LightningMap, r2.xy);
  r2 = texture2D(LightningMap, r2.zw);
  r0.z = r3.x*c13.x;
  r0.z = r2.x*r0.z;
  r0.z = r1.x*r0.z;
  r1.xyz = r0.zzz*LightningColor.xyz;
  r0.xzw = saturate(r0.xxx*r1.xyz);
  r1.x = dot(v3.xyz, v3.xyz);
  r1.x = r1.x == 0.0?3.402823466e+38:inversesqrt(abs(r1.x));
  r1.y = r1.x*v3.z;
  r1.z = saturate(r1.y);
  r1.z = (-r1.z)+c8.y;
  r1.w = r1.z*r1.z;
  r1.z = r1.w*r1.z;
  r1.w = dot(v2.xyz, v2.xyz);
  r1.w = r1.w == 0.0?3.402823466e+38:inversesqrt(abs(r1.w));
  r1.w = r1.w*v2.z;
  r1.x = r1.w*c8.x+c8.x;
  r2 = texture2D(GroundScattering1, vec2(r1.x, 1.0-r1.y));
  r3 = texture2D(GroundScattering2, vec2(r1.x, 1.0-r1.y));
  r1.xyw = r2.xyz+AmbientColor.xyz;
  r2.xyz = r1.xyw+AmbientColor.xyz;
  r4.y = CloudsFactors.y;
  r4.xyz = r4.yyy*CloudsColor.xyz;
  r2.xyz = r2.xyz*r4.xyz;
  r2.xyz = r1.zzz*c14.zzz+r2.xyz;
  r0.xzw = r0.xzw+r2.xyz;
  r0.xzw = PlanetColor.xyz*(-r1.xyw)+r0.xzw;
  r1.xyz = r1.xyw*PlanetColor.xyz;
  r0.xyz = r0.yyy*r0.xzw+r1.xyz;
  r0.xyz = r3.xyz+r0.xyz;
  r1.xyz = r0.xyz+c14.www;
  r2.xyz = r0.xyz*c15.xxx;
  r0.xyz = r0.xyz+c15.yyy;
  r0.xyz = r0.xyz*c15.zzz;
  r3.x = abs(r0.x)>0.0?log2(abs(r0.x)):-3.402823466e+38;
  r3.y = abs(r0.y)>0.0?log2(abs(r0.y)):-3.402823466e+38;
  r3.z = abs(r0.z)>0.0?log2(abs(r0.z)):-3.402823466e+38;
  r0.xyz = r3.xyz*c15.www;
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
  r1.xyz = max(r0.xyz, c8.zzz);
  r0.x = r1.x>0.0?log2(r1.x):-3.402823466e+38;
  r0.y = r1.y>0.0?log2(r1.y):-3.402823466e+38;
  r0.z = r1.z>0.0?log2(r1.z):-3.402823466e+38;
  r0.xyz = r0.xyz*fogSettings.www;
  r1.xyz = r0.xyz*c16.zzz;
  r2.x = exp2(r1.x);
  r2.y = exp2(r1.y);
  r2.z = exp2(r1.z);
  r1.xyz = r2.xyz*c17.xxx+c17.yyy;
  r2.x = exp2(r0.x);
  r2.y = exp2(r0.y);
  r2.z = exp2(r0.z);
  r0.xyz = r2.xyz+c16.xxx;
  r2.xyz = r2.xyz*c16.yyy; {
    bvec3 tmp = greaterThanEqual(r0.xyz, vec3(0.0));
    gl_FragColor.xyz = vec3(tmp.x?r1.x:r2.x, tmp.y?r1.y:r2.y, tmp.z?r1.z:r2.z);
  };
  gl_FragColor.w = c8.y;
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
