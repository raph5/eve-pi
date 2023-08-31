varying vec2 vertexUV;
varying vec3 vertexPosition;

void main() {
  vertexPosition = position;
  vertexUV = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}