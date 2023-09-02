uniform sampler2D pinTexture;
uniform vec3 ringColor;
uniform float focus;

varying vec2 vertexUV;
varying vec3 vertexPos;

void main() {
  float posLength = length(vertexPos);

  if(posLength < 0.43 + focus * 0.3) {
    gl_FragColor = texture2D(pinTexture, vertexUV.xy * 4.0 - 1.5);
  }
  else if(posLength < 0.5 + focus * 0.3) {
    gl_FragColor = vec4(ringColor, 1);
  }
  else {
    gl_FragColor = vec4(0);
  }
}