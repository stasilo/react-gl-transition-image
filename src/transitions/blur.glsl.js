// author: gre
// license: MIT

export default `
    const float intensity = 0.3;
    const int passes = 6;

    vec4 transition(vec2 uv) {
        vec4 c1 = vec4(0.0);
        vec4 c2 = vec4(0.0);

        float disp = intensity*(0.5-distance(0.5, progress));
        for (int xi=0; xi<passes; xi++) {
            float x = float(xi) / float(passes) - 0.5;
            for (int yi=0; yi<passes; yi++) {
                float y = float(yi) / float(passes) - 0.5;
                vec2 v = vec2(x,y);
                float d = disp;
                c2 += getToColor( uv + d*v);
            }
        }

        c2 /= float(passes*passes);
        return mix(c1, c2, progress);
    }
`;
