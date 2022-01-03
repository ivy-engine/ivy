uniform float amplitude;
attribute float displacement;
varying vec3 vNormal;

void main() {

  vNormal = normal;

  // multiply our displacement by
  // the amplitude. The amp will
  // get animated so we'll have
  // animated displacement
  vec3 newPosition = position + normal;

  gl_Position = projectionMatrix *
    modelViewMatrix *
    vec4(newPosition, 1.0);
}
