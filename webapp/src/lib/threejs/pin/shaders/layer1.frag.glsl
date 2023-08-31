uniform vec3 pinBg;

varying vec3 vertexPosition;

void main() {
  float posLength = length(vertexPosition);
  
  if(posLength < 0.5) {
    gl_FragColor = vec4(1);
  }
  else if(posLength < 1.0) {
    gl_FragColor = vec4(pinBg, 1);
  }
  else {
    gl_FragColor = vec4(0);
  }
}