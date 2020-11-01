export default `
    // https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

    float rand(vec2 n) {
        return fract(sin(dot(n, vec2(12.9898 + seed, 4.1414))) * 43758.5453);
    }

    float noise(vec2 p){
        vec2 ip = floor(p);
        vec2 u = fract(p);

        u = u*u*(3.0-2.0*u);

        float res = mix(
            mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
            mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),
            u.y
        );

        return res*res;
    }

    vec4 transition(vec2 uv) {
        return getToColor(uv + (noise(uv*4.)*(1. - (1./progress))));
    }
`;
