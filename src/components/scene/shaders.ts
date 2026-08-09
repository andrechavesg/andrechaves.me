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

// Still-frame targets per act band — swarm must resolve into legibility.
void main() {
  vec4 pos = texture2D(uPositions, vUv);
  vec3 p = pos.xyz;
  float id = hash(vUv);
  float id2 = hash(vUv + 0.37);

  float cold = 1.0 - smoothstep(0.0, 0.12, uProgress);
  float swarm = smoothstep(0.08, 0.28, uProgress) * (1.0 - smoothstep(0.32, 0.48, uProgress));
  float guard = smoothstep(0.28, 0.42, uProgress) * (1.0 - smoothstep(0.48, 0.58, uProgress));
  float studio = smoothstep(0.48, 0.62, uProgress) * (1.0 - smoothstep(0.68, 0.78, uProgress));
  float product = smoothstep(0.62, 0.72, uProgress) * (1.0 - smoothstep(0.78, 0.88, uProgress));
  float record = smoothstep(0.78, 0.88, uProgress) * (1.0 - smoothstep(0.9, 0.97, uProgress));
  float cool = smoothstep(0.9, 1.0, uProgress);

  // Cold open: single ember cluster + sparse ash
  float emberR = mix(0.08, 0.35, step(0.92, id));
  vec3 ember = vec3(
    sin(id * 40.0) * emberR * 0.15,
    cos(id2 * 33.0) * emberR * 0.15 - 0.6,
    (id - 0.5) * emberR * 0.2
  );
  // Keep most particles near the ember; a few drift as ash
  if (id < 0.92) {
    ember = vec3(0.0, -0.55, 0.0) + vec3(sin(id * 12.0), cos(id2 * 9.0), sin(id * 7.0)) * 0.12;
  }

  // Swarm: self-organising helix / ring
  float ang = id * 6.28318 + uTime * 0.35;
  float radius = 1.2 + id2 * 1.4;
  vec3 ring = vec3(
    cos(ang) * radius,
    sin(ang * 1.5 + uTime * 0.2) * 0.85,
    sin(ang) * radius * 0.65
  );

  // Guardrail: cubic lattice
  vec3 origin = vec3((vUv.x - 0.5) * 7.0, (vUv.y - 0.5) * 7.0, id * 3.0 - 1.5);
  vec3 lattice = vec3(
    floor(origin.x * 1.6) / 1.6,
    floor(origin.y * 1.6) / 1.6,
    floor(origin.z * 1.6) / 1.6
  );

  // Studio / product: anvil plate vs clock disc
  float a2 = id * 6.28318;
  vec3 anvil = vec3(
    mix(-1.4, 1.4, vUv.x) * 0.9 - 2.0,
    mix(-0.6, 0.9, smoothstep(0.3, 0.7, vUv.y)) * 0.8,
    (id - 0.5) * 0.4
  );
  vec3 disc = vec3(
    cos(a2) * (0.5 + id2 * 0.9) + 2.0,
    sin(a2) * (0.5 + id2 * 0.9),
    sin(uTime * 0.3 + id) * 0.2
  );

  // Record: vertical columns (timeline)
  vec3 columns = vec3(
    floor(id * 9.0) * 0.55 - 2.2,
    (vUv.y - 0.5) * 3.2,
    (id2 - 0.5) * 0.8
  );

  // Cooling: settle to floor embers
  vec3 banked = vec3((vUv.x - 0.5) * 5.0, -1.4 + id * 0.15, (vUv.y - 0.5) * 3.0);

  vec3 target = ember * cold
    + ring * swarm
    + lattice * guard
    + anvil * studio
    + disc * product
    + columns * record
    + banked * cool;

  float weight = cold + swarm + guard + studio + product + record + cool;
  target /= max(weight, 0.001);

  if (uHitl > 0.5 && uHitl < 1.5) {
    // Approved: tighten toward a verified glyph (checkmark-ish fold)
    vec3 check = vec3(
      mix(-0.6, 0.2, smoothstep(0.0, 0.45, id)) + mix(0.2, 0.9, smoothstep(0.45, 1.0, id)) * 0.5,
      mix(-0.4, 0.1, smoothstep(0.0, 0.45, id)) + mix(0.1, 0.7, smoothstep(0.45, 1.0, id)) * -0.35,
      (id2 - 0.5) * 0.15
    );
    target = mix(target, check, 0.85);
  }
  if (uHitl < -0.5) {
    target += vec3(sin(uTime * 5.0 + id * 20.0), cos(uTime * 4.0), sin(uTime * 3.0 + id2)) * 1.1;
  }
  if (uHitl > 1.5) {
    // Green check lied — scatter after false settle
    target += normalize(origin + 0.001) * (1.2 + id);
  }

  float damp = 0.035 + swarm * 0.05 + guard * 0.03;
  if (uHitl > 0.5 && uHitl < 1.5) damp = 0.12;
  p += (target - p) * damp;
  gl_FragColor = vec4(p, 1.0);
}
`

export const renderVertex = /* glsl */ `
uniform sampler2D uPositions;
uniform float uSize;
uniform float uProgress;
varying float vShade;
varying float vAct;
void main() {
  vec3 pos = texture2D(uPositions, position.xy).xyz;
  vShade = position.z;
  vAct = uProgress;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float pulse = 1.0 + 0.15 * sin(pos.x * 3.0 + pos.y * 2.0);
  gl_PointSize = uSize * pulse * (280.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`

export const renderFragment = /* glsl */ `
precision mediump float;
varying float vShade;
varying float vAct;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.08, d);
  vec3 ember = vec3(1.0, 0.42, 0.0);
  vec3 molten = vec3(1.0, 0.54, 0.12);
  vec3 steel = vec3(0.58, 0.64, 0.72);
  float cool = smoothstep(0.85, 1.0, vAct);
  vec3 col = mix(mix(ember, molten, vShade), steel, cool * 0.45);
  // Cold-open ember reads hotter / brighter
  float cold = 1.0 - smoothstep(0.0, 0.12, vAct);
  col = mix(col, vec3(1.0, 0.55, 0.12), cold * 0.35);
  gl_FragColor = vec4(col, a * mix(0.95, 0.55, cool));
}
`
