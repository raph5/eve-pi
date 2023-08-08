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
uniform sampler2D s1;
uniform sampler2D s2;
uniform sampler2D s3;
uniform sampler2D s4;
uniform sampler2D s5;
uniform sampler2D s6;
uniform sampler2D s7;
uniform sampler2D s8;
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

uniform vec4 cb7[11];
uniform vec4 fogSettings;
uniform vec4 AmbientColor;
uniform float time;

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
  vec4 c11 = vec4(0.5, 0.00999999978, 2, -1);
  vec4 c12 = vec4(4, 1, 0, 2);
  vec4 c13 = vec4(0.000277777785, 0, -0.0404499359, 0.0773993805);
  vec4 c14 = vec4(0.0549999997, 0.947867274, 2.4000001, -0.00313080009);
  vec4 c15 = vec4(12.9200001, 0.416666657, 1.05499995, -0.0549999997);
  vec4 c16 = vec4(10, -1, 1, -0.00350000011);
  v0 = texcoord;
  v1 = texcoord4;
  v2 = texcoord6;
  v3 = texcoord7;

  r0 = texture2D(s3, v0.xy);
  r0.xy = r0.xy*c11.zz+c11.ww;
  r0.z = r0.z*r0.w+(-cb7[1].x);
  r0.z = saturate(r0.z*c12.x);
  r0.w = dot(r0.xy, (-r0.xy))+c12.y;
  r1.xy = r0.xy*cb7[1].yy;
  r1.w = max(r0.w, c12.z);
  r0.x = r1.w == 0.0?3.402823466e+38:inversesqrt(abs(r1.w));
  r1.z = 1.0/r0.x;
  r0.x = dot(r1.xyz, r1.xyz);
  r0.x = r0.x == 0.0?3.402823466e+38:inversesqrt(abs(r0.x));
  r2.xyz = r0.xxx*r1.xyz;
  r0.xyw = r1.xyz*(-r0.xxx)+c12.zzy;
  r1 = texture2D(s1, v0.xy);
  r1.x = (-r1.x)+c12.y;
  r2.w = pow(abs(r1.x), c16.x);
  r0.xyw = r2.www*r0.xyw+r2.xyz;
  r1.y = (-r0.w)+c12.y;
  r1.y = r1.y+r1.y;
  r1.z = r1.x*r1.x;
  r1.x = saturate(dot(r1.xx, r1.zz)+c12.z);
  r1.zw = c11.xx*v0.zw;
  r2 = texture2D(s4, r1.zw);
  r1.zw = r1.zw*cb7[0].xx;
  r3 = texture2D(s2, r1.zw);
  r1.z = r2.z*r2.w+(-r0.z);
  r0.z = r1.x*r1.z+r0.z;
  r2.yzw = c12.yzw;
  r4 = cb7[0].xxxx*r2.yzzy+r2.zywz;
  r1.zw = r4.xy*v0.xy;
  r1.zw = r4.zw*r1.zw;
  r4 = texture2D(s2, r1.zw);
  r5 = mix(r4, r3, r1.xxxx);
  r1.x = r5.z*cb7[0].y;
  r0.z = r1.x*c11.y+r0.z;
  r1.x = r0.z+(-cb7[1].x);
  r1.x = (-r1.x)+cb7[8].y;
  r1.x = saturate(cb7[3].x*r1.x+(-r1.y));
  r1.yzw = r5.xxx*cb7[4].xyz;
  r2.xzw = r5.yyy*cb7[5].xyz+(-r1.yzw);
  r1.xyz = r1.xxx*r2.xzw+r1.yzw;
  r2.xzw = r5.zzz*cb7[6].xyz+(-r1.xyz);
  r1.w = cb7[8].z+cb7[8].x;
  r1.w = (-r1.w)+c12.y;
  r1.w = r0.z+(-r1.w);
  r1.w = saturate(r1.w*cb7[3].y);
  r1.xyz = r1.www*r2.xzw+r1.xyz;
  r2.xzw = r5.www*cb7[7].xyz+(-r1.xyz);
  r1.w = r2.y+(-cb7[8].z);
  r0.z = r0.z+(-r1.w);
  r1.w = r0.w*cb7[3].z;
  r0.z = saturate(r0.z*r1.w);
  r1.xyz = r0.zzz*r2.xzw+r1.xyz;
  r0.z = dot(v2.xyz, v2.xyz);
  r0.z = r0.z == 0.0?3.402823466e+38:inversesqrt(abs(r0.z));
  r2 = r0.zzzz*v2.zxyz;
  r3.xyz = r2.yzw*c16.yyz;
  r0.x = dot(r0.xyw, r3.xyz);
  r0.x = saturate(v2.z*r0.z+r0.x);
  r0.y = dot(v3.xyz, v3.xyz);
  r0.y = r0.y == 0.0?3.402823466e+38:inversesqrt(abs(r0.y));
  r3.y = r0.y*v3.z;
  r0.y = saturate(r3.y);
  r0.y = (-r0.y)+c12.y;
  r0.y = r0.y*r0.y;
  r0.y = r0.y*r0.y;
  r0.y = r0.y*r0.y;
  r0.y = r0.y*r0.x;
  r3.x = r2.x*c11.x+c11.x;
  r4 = texture2D(s5, vec2(r3.x, 1.0-r3.y));
  r3 = texture2D(s6, vec2(r3.x, 1.0-r3.y));
  r4.xyz = r4.xyz+AmbientColor.xyz;
  r0.xzw = r4.xyz*c11.xxx+r0.xxx;
  r0.xyz = r1.xyz*r0.xzw+r0.yyy;
  r1.xyz = cb7[10].xxx*r3.xyz+(-r0.xyz);
  r5.xy = c13.xy;
  r2.xw = r5.xy*time;
  r2.xw = fract(r2.xw);
  r2.yz = r2.yz*c16.ww+r2.xw;
  r5 = cb7[10].wwww*v0;
  r2.yz = r5.xy*c12.wy+r2.yz;
  r6 = texture2D(s7, r2.yz);
  r0.w = pow(abs(r6.x), cb7[10].z);
  r0.xyz = r0.www*r1.xyz+r0.xyz;
  r1.y = cb7[10].y;
  r1.xyz = r1.yyy*cb7[9].xyz;
  r1.xyz = r1.xyz*r4.xyz+(-r0.xyz);
  r2.xy = r5.xy*c12.wy+r2.xw;
  r4 = texture2D(s8, r5.zw);
  r2 = texture2D(s7, r2.xy);
  r0.w = max(r2.x, r4.x);
  r1.w = pow(abs(r0.w), cb7[10].z);
  r0.xyz = r1.www*r1.xyz+r0.xyz;
  r0.xyz = r3.xyz+r0.xyz;
  r1.xyz = r0.xyz+c13.zzz;
  r2.xyz = r0.xyz*c13.www;
  r0.xyz = r0.xyz+c14.xxx;
  r0.xyz = r0.xyz*c14.yyy;
  r3.x = abs(r0.x)>0.0?log2(abs(r0.x)):-3.402823466e+38;
  r3.y = abs(r0.y)>0.0?log2(abs(r0.y)):-3.402823466e+38;
  r3.z = abs(r0.z)>0.0?log2(abs(r0.z)):-3.402823466e+38;
  r0.xyz = r3.xyz*c14.zzz;
  r3.x = exp2(r0.x);
  r3.y = exp2(r0.y);
  r3.z = exp2(r0.z); {
    bvec3 tmp = greaterThanEqual(r1.xyz, vec3(0.0));
    r0.xyz = vec3(tmp.x?r3.x:r2.x, tmp.y?r3.y:r2.y, tmp.z?r3.z:r2.z);
  };
  r1.xyz = (-v1.xyz);
  r1.w = fogSettings.z;
  r2.y = fogSettings.y;
  r3.xyz = vec3(0);
  r0.w = saturate(v1.w);
  r0.xyz = r0.www*r3.xyz+r0.xyz;
  r1.xyz = max(r0.xyz, c12.zzz);
  r0.x = r1.x>0.0?log2(r1.x):-3.402823466e+38;
  r0.y = r1.y>0.0?log2(r1.y):-3.402823466e+38;
  r0.z = r1.z>0.0?log2(r1.z):-3.402823466e+38;
  r0.xyz = r0.xyz*fogSettings.www;
  r1.xyz = r0.xyz*c15.yyy;
  r2.x = exp2(r1.x);
  r2.y = exp2(r1.y);
  r2.z = exp2(r1.z);
  r1.xyz = r2.xyz*c15.zzz+c15.www;
  r2.x = exp2(r0.x);
  r2.y = exp2(r0.y);
  r2.z = exp2(r0.z);
  r0.xyz = r2.xyz+c14.www;
  r2.xyz = r2.xyz*c15.xxx; {
    bvec3 tmp = greaterThanEqual(r0.xyz, vec3(0.0));
    gl_FragColor.xyz = vec3(tmp.x?r1.x:r2.x, tmp.y?r1.y:r2.y, tmp.z?r1.z:r2.z);
  };
  gl_FragColor.w = c12.y;
  #ifdef PS
    float av = floor(clamp(gl_FragData[0].a, 0.0, 1.0)*255.0+0.5);
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