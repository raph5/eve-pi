uniform vec3 pinBg;
uniform float focus;

varying vec3 vertexPos;

void main() {
  float posLength = length(vertexPos);
  
  if(posLength < 0.25) {
    gl_FragColor = vec4(1);
  }
  else if(posLength < 0.5 + focus * 0.3) {
    gl_FragColor = vec4(pinBg, 1);
  }
  else {
    gl_FragColor = vec4(0);
  }
}