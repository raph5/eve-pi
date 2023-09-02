uniform sampler2D pinTexture;
uniform vec3 primaryColor;
uniform float focus;

varying vec2 vertexUV;
varying vec3 vertexPos;

void main() {
  float posLength = length(vertexPos);

  if(posLength < 0.435 + focus * 0.3) {
    gl_FragColor = texture2D(pinTexture, vertexUV.xy * 4.0 - 1.5);
    gl_FragColor.xyz *= primaryColor;
  }
  else if(posLength < 0.5 + focus * 0.3 && abs(vertexPos.x / vertexPos.y) > 0.13) {
    gl_FragColor = vec4(primaryColor, 1);
  }
  else {
    gl_FragColor = vec4(0);
  }
}