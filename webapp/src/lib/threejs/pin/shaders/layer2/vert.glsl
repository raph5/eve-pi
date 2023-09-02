varying vec2 vertexUV;
varying vec3 vertexPos;

void main() {
  vertexPos = position;
  vertexUV = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}