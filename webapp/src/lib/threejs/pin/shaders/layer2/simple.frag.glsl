#define PI 3.1415926538

uniform sampler2D pinTexture;
uniform vec3 primaryColor;
uniform vec3 secondaryColor;
uniform float focus;
uniform float rings[1];

varying vec2 vertexUV;
varying vec3 vertexPos;

void main() {
  float posLength = length(vertexPos);

  if(posLength < 0.435 + focus * 0.3) {
    gl_FragColor.xyz = texture2D(pinTexture, vertexUV.xy * 4.0 - 1.5).xyz * primaryColor;
    gl_FragColor.w = posLength < 0.25 ? 1.0 : 0.0;
  }
  else if(posLength < 0.5 + focus * 0.3) {
    vec3 normPos = normalize(vertexPos);
    float angle = atan(normPos.x * 2.0, normPos.y * 2.0);
    
    gl_FragColor = vec4(angle/PI/2.0+0.5 < rings[0] ? primaryColor : secondaryColor, 1);
  }
  else {
    gl_FragColor = vec4(0);
  }
}