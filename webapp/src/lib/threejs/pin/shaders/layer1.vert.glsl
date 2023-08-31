varying vec3 vertexPosition;

void main() {
  vertexPosition = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}