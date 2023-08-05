#ifdef GL_ES
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif
#endif
varying vec4 texcoord;
varying vec4 texcoord6;
varying vec4 texcoord7;
uniform sampler2D s0;
uniform sampler2D s1;
uniform sampler2D s2;
uniform sampler2D s3;
uniform vec4 AmbientColor;
uniform vec4 cb7[3];
uniform float time;
#ifdef PS
  uniform vec4 ssi;
  varying float ssv;
#endif
void main() {
  vec4 v0;
  vec4 v1;
  vec4 v2;
  vec4 r0;
  vec4 r1;
  vec4 r2;
  vec4 r3;
  vec4 r4;
  vec4 r5;
  vec4 c3 = vec4(2, 1, 0.0773993805, 0.0549999997);
  vec4 c4 = vec4(0.5, 0.000277777785, 0, -0.0404499359);
  vec4 c5 = vec4(0.947867274, 2.4000001, -0.00313080009, 12.9200001);
  vec4 c6 = vec4(0.416666657, 1.05499995, -0.0549999997, 0);
  v0 = texcoord;
  v1 = texcoord6;
  v2 = texcoord7;
  r0.yz = c4.yz;
  r0.xy = r0.yz*cb7[0].xx;
  r0.xy = fract(r0.xy);
  r1 = cb7[2].wwww*v0;
  r0.xy = r1.xy*c3.xy+r0.xy;
  r1 = texture2D(s3, r1.zw);
  r0 = texture2D(s2, r0.xy);
  r2.x = max(r0.x, r1.x);
  r0.x = pow(abs(r2.x), cb7[2].z);
  r0.y = dot(v1.xyz, v1.xyz);
  r0.y = r0.y == 0.0?3.402823466e+38:inversesqrt(abs(r0.y));
  r0.y = r0.y*v1.z;
  r1.x = r0.y*c4.x+c4.x;
  r0.y = dot(v2.xyz, v2.xyz);
  r0.y = r0.y == 0.0?3.402823466e+38:inversesqrt(abs(r0.y));
  r1.y = 1.0-(r0.y*v2.z);
  r2 = texture2D(s0, r1.xy);
  r1 = texture2D(s1, r1.xy);
  r5.xyz = r1.xyz;
  r0.yzw = r2.xyz+AmbientColor.xyz;
  r2.y = cb7[2].y;
  r2.xyz = r2.yyy*cb7[1].xyz;
  r0.yzw = r0.yzw*r2.xyz;
  r0.yzw = r0.xxx*r0.yzw+r1.xyz;
  r4.x = r0.x;
  gl_FragColor.w = r0.x;
  r1.xyz = r0.yzw+c4.www;
  r2.xyz = r0.yzw*c3.zzz;
  r0.xyz = r0.yzw+c3.www;
  r0.xyz = r0.xyz*c5.xxx;
  r3.x = abs(r0.x)>0.0?log2(abs(r0.x)):-3.402823466e+38;
  r3.y = abs(r0.y)>0.0?log2(abs(r0.y)):-3.402823466e+38;
  r3.z = abs(r0.z)>0.0?log2(abs(r0.z)):-3.402823466e+38;
  r0.xyz = r3.xyz*c5.yyy;
  r3.x = exp2(r0.x);
  r3.y = exp2(r0.y);
  r3.z = exp2(r0.z);
  {
    bvec3 tmp = greaterThanEqual(r1.xyz, vec3(0.0));
    r0.xyz = vec3(tmp.x?r3.x:r2.x, tmp.y?r3.y:r2.y, tmp.z?r3.z:r2.z);
  };
  r1.xyz = max(r0.xyz, c4.zzz);
  r0.x = r1.x>0.0?log2(r1.x):-3.402823466e+38;
  r0.y = r1.y>0.0?log2(r1.y):-3.402823466e+38;
  r0.z = r1.z>0.0?log2(r1.z):-3.402823466e+38;
  r0.xyz = r0.xyz;
  r1.xyz = r0.xyz*c6.xxx;
  r2.x = exp2(r1.x);
  r2.y = exp2(r1.y);
  r2.z = exp2(r1.z);
  r1.xyz = r2.xyz*c6.yyy+c6.zzz;
  r2.x = exp2(r0.x);
  r2.y = exp2(r0.y);
  r2.z = exp2(r0.z);
  r0.xyz = r2.xyz+c5.zzz;
  r2.xyz = r2.xyz*c5.www;
  {
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
