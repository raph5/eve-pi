uniform sampler2D pinTexture;
uniform vec3 ringColor;

varying vec2 vertexUV;
varying vec3 vertexPosition;

void main() {
  float posLength = length(vertexPosition);

  if(posLength < 0.86) {
    gl_FragColor = texture2D(pinTexture, vertexUV.xy * 2.0 - 0.5);
  }
  else if(posLength < 1.0) {
    gl_FragColor = vec4(ringColor, 1);
  }
  else {
    gl_FragColor = vec4(0);
  }
}