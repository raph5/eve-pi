#ifdef GL_ES
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif
#endif
varying vec4 texcoord4;
varying vec4 color;
varying vec4 color1;
uniform vec4 cb2[22];
uniform vec4 fogSettings;
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
    vec4 c0 = vec4(1, 0.00500413869, -1.99000001, 1.99002504);
    vec4 c1 = vec4(1.5, -0.0404499359, 0.0773993805, 0.0549999997);
    vec4 c2 = vec4(0.947867274, 2.4000001, 0, -0.00313080009);
    vec4 c3 = vec4(12.9200001, 0.416666657, 1.05499995, -0.0549999997);
    v0 = texcoord4;
    v1 = color;
    v2 = color1;
    r0.xyz = getSunDirection(cameraPosition);
    r0.x = dot(r0.xyz, v0.xyz);
    r0.y = dot(v0.xyz, v0.xyz);
    r0.y = r0.y == 0.0?3.402823466e+38:inversesqrt(abs(r0.y));
    r0.x = r0.y*r0.x;
    r0.y = r0.x*(-c0.z)+c0.w;
    r0.x = r0.x*r0.x+c0.x;
    r0.x = r0.x*c0.y;
    r1.x = pow(abs(r0.y), c1.x);
    r0.y = 1.0/r1.x;
    r0.x = r0.y*r0.x;
    r1.xyz = v2.xyz;
    r0.xyz = r0.xxx*r1.xyz+v1.xyz;
    r1.xyz = min(r0.xyz, c0.xxx);
    r0.xyz = r1.xyz+c1.yyy;
    r2.xyz = r1.xyz*c1.zzz;
    r1.xyz = r1.xyz+c1.www;
    r1.xyz = r1.xyz*c2.xxx;
    r3.x = abs(r1.x)>0.0?log2(abs(r1.x)):-3.402823466e+38;
    r3.y = abs(r1.y)>0.0?log2(abs(r1.y)):-3.402823466e+38;
    r3.z = abs(r1.z)>0.0?log2(abs(r1.z)):-3.402823466e+38;
    r1.xyz = r3.xyz*c2.yyy;
    r3.x = exp2(r1.x);
    r3.y = exp2(r1.y);
    r3.z = exp2(r1.z); {
      bvec3 tmp = greaterThanEqual(r0.xyz, vec3(0.0));
      r0.xyz = vec3(tmp.x?r3.x:r2.x, tmp.y?r3.y:r2.y, tmp.z?r3.z:r2.z);
    };
    r1.xyz = max(r0.xyz, c2.zzz);
    r0.x = r1.x>0.0?log2(r1.x):-3.402823466e+38;
    r0.y = r1.y>0.0?log2(r1.y):-3.402823466e+38;
    r0.z = r1.z>0.0?log2(r1.z):-3.402823466e+38;
    r0.xyz = r0.xyz*fogSettings.www;
    r1.xyz = r0.xyz*c3.yyy;
    r2.x = exp2(r1.x);
    r2.y = exp2(r1.y);
    r2.z = exp2(r1.z);
    r1.xyz = r2.xyz*c3.zzz+c3.www;
    r2.x = exp2(r0.x);
    r2.y = exp2(r0.y);
    r2.z = exp2(r0.z);
    r0.xyz = r2.xyz+c2.www;
    r2.xyz = r2.xyz*c3.xxx; {
      bvec3 tmp = greaterThanEqual(r0.xyz, vec3(0.0));
      gl_FragColor.xyz = vec3(tmp.x?r1.x:r2.x, tmp.y?r1.y:r2.y, tmp.z?r1.z:r2.z);

      // background
      gl_FragColor.x = max(gl_FragColor.x, 0.13333);
      gl_FragColor.y = max(gl_FragColor.y, 0.13333);
      gl_FragColor.z = max(gl_FragColor.z, 0.13333);
    };
    gl_FragColor.w = c0.x;
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