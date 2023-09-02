varying vec3 vertexPos;

void main() {
  vertexPos = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}