
// uniform vec2 uPlaneResolution;
// uniform vec2 uTextureSize;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}   