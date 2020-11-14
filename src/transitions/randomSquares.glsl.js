// Author: gre
// License: MIT

export default `
    const ivec2 size = ivec2(10, 10);
    const float smoothness = 0.5;

    float rand (vec2 co) {
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    vec4 transition(vec2 p) {
        float r = rand(floor(vec2(size) * p));
        float m = smoothstep(0.0, -smoothness, r - (progress * (1.0 + smoothness)));
        return mix(vec4(0.), getToColor(p), m);
    }
`;
