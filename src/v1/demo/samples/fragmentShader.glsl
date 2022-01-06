#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec3 colorA = vec3(1, 0, 0);
vec3 colorB = vec3(0, 1, 0);

void main() {
  vec3 color = vec3(0.0);

  float pct = cos(u_time * 2.) * 0.5 + 0.5;
  color = mix(colorA, colorB, pct);

  gl_FragColor = vec4(color, 1.0);
}