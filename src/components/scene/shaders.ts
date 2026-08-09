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

  // Bias formations into the right half so left-column DOM stays legible.
  const float stageX = 1.35;

  // Cold open: single ember cluster + sparse ash
  float emberR = mix(0.08, 0.28, step(0.92, id));
  vec3 ember = vec3(
    stageX + sin(id * 40.0) * emberR * 0.12,
    cos(id2 * 33.0) * emberR * 0.12 - 0.65,
    (id - 0.5) * emberR * 0.18
  );
  // Keep most particles near the ember; a few drift as ash
  if (id < 0.92) {
    ember = vec3(stageX, -0.6, 0.0) + vec3(sin(id * 12.0), cos(id2 * 9.0), sin(id * 7.0)) * 0.1;
  }

  // Swarm: self-organising helix / ring (smaller, stage-right)
  float ang = id * 6.28318 + uTime * 0.35;
  float radius = 0.75 + id2 * 0.85;
  vec3 ring = vec3(
    stageX + cos(ang) * radius,
    sin(ang * 1.5 + uTime * 0.2) * 0.55,
    sin(ang) * radius * 0.55
  );

  // Guardrail: cubic lattice (stage-right)
  vec3 origin = vec3((vUv.x - 0.5) * 5.0 + stageX, (vUv.y - 0.5) * 5.0, id * 2.4 - 1.2);
  vec3 lattice = vec3(
    floor(origin.x * 1.6) / 1.6,
    floor(origin.y * 1.6) / 1.6,
    floor(origin.z * 1.6) / 1.6
  );

  // Studio / product: anvil plate vs clock disc
  float a2 = id * 6.28318;
  vec3 anvil = vec3(
    stageX + mix(-0.8, 0.8, vUv.x) * 0.7,
    mix(-0.5, 0.7, smoothstep(0.3, 0.7, vUv.y)) * 0.7,
    (id - 0.5) * 0.35
  );
  vec3 disc = vec3(
    stageX + cos(a2) * (0.4 + id2 * 0.7),
    sin(a2) * (0.4 + id2 * 0.7),
    sin(uTime * 0.3 + id) * 0.18
  );

  // Record: vertical columns (timeline)
  vec3 columns = vec3(
    stageX + floor(id * 7.0) * 0.4 - 1.2,
    (vUv.y - 0.5) * 2.8,
    (id2 - 0.5) * 0.6
  );

  // Cooling: settle to floor embers
  vec3 banked = vec3(stageX + (vUv.x - 0.5) * 3.5, -1.4 + id * 0.12, (vUv.y - 0.5) * 2.5);

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
      stageX + mix(-0.5, 0.15, smoothstep(0.0, 0.45, id)) + mix(0.15, 0.7, smoothstep(0.45, 1.0, id)) * 0.45,
      mix(-0.35, 0.08, smoothstep(0.0, 0.45, id)) + mix(0.08, 0.55, smoothstep(0.45, 1.0, id)) * -0.3,
      (id2 - 0.5) * 0.12
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
  gl_PointSize = uSize * pulse * (160.0 / -mv.z);
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
