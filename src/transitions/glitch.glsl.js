// author: Gunnar Roth
// based on work from natewave
// adapted by Jakob Stasilowicz
// license: MIT

export default `
    vec4 transition(vec2 p) {
        vec2 block = floor(p.xy / vec2(16));
        vec2 uv_noise = block / vec2(64);
        uv_noise += floor(vec2(progress) * vec2(1200.0, 3500.0)) / vec2(64);
        vec2 dist = progress > 0.0 ? (fract(uv_noise) - 0.5) * 0.3 *(1.0 -progress) : vec2(0.0);

        vec2 red = p + dist * 0.2;
        vec2 green = p + dist * .3;
        vec2 blue = p + dist * .5;

        return vec4(
            getToColor(red).r,
            getToColor(green).g,
            getToColor(blue).b,
            1.0
        );
    }
`;
