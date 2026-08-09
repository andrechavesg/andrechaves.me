export const simVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export const simFragment = /* glsl */ `
precision mediump float;
uniform sampler2D uPositions;
uniform float uTime;
uniform float uProgress;
uniform float uHitl; // 0 idle, 1 approve, -1 reject, 2 lied
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec4 pos = texture2D(uPositions, vUv);
  vec3 p = pos.xyz;
  float id = hash(vUv);

  // target forms by act progress
  float swarm = smoothstep(0.05, 0.25, uProgress);
  float guard = smoothstep(0.22, 0.4, uProgress);
  float cool = smoothstep(0.85, 1.0, uProgress);

  vec3 origin = vec3((vUv.x - 0.5) * 8.0, (vUv.y - 0.5) * 8.0, id * 2.0 - 1.0);
  float ang = id * 6.28318 + uTime * 0.15;
  vec3 ring = vec3(cos(ang) * (1.5 + id), sin(ang) * (1.5 + id), sin(uTime * 0.2 + id) * 0.5);
  vec3 lattice = vec3(
    floor(origin.x * 2.0) * 0.5,
    floor(origin.y * 2.0) * 0.5,
    floor(origin.z * 2.0) * 0.35
  );

  vec3 target = mix(origin * 0.2, ring, swarm);
  target = mix(target, lattice, guard * 0.85);
  target = mix(target, origin * 0.05, cool);

  if (uHitl < -0.5) {
    target += vec3(sin(uTime * 4.0 + id * 20.0), cos(uTime * 3.0), 0.0) * 0.8;
  }
  if (uHitl > 1.5) {
    // green check lied — scatter after false settle
    target += normalize(origin + 0.001) * 1.5;
  }

  float damp = 0.04 + swarm * 0.04;
  p += (target - p) * damp;
  gl_FragColor = vec4(p, 1.0);
}
`

export const renderVertex = /* glsl */ `
uniform sampler2D uPositions;
uniform float uSize;
varying float vShade;
void main() {
  vec3 pos = texture2D(uPositions, position.xy).xyz;
  vShade = position.z;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize * (300.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

export const renderFragment = /* glsl */ `
precision mediump float;
varying float vShade;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.1, d);
  vec3 ember = vec3(1.0, 0.42, 0.0);
  vec3 molten = vec3(1.0, 0.54, 0.12);
  vec3 col = mix(ember, molten, vShade);
  gl_FragColor = vec4(col, a * 0.85);
}
`
