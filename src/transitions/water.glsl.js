// original author: Paweł Płóciennik
// adapted by: Jakob Stasilowicz
// license: MIT

export default `
    const float amplitude = 30.;
    const float speed = 10.;

    vec4 transition(vec2 p) {
        vec2 dir = p - vec2(.5);
        float dist = length(dir);

        if (dist > progress) {
            return vec4(0.);
        } else {
            vec2 offset = dir * sin(dist * amplitude - progress * speed);
            return getToColor( p + (offset * (1. - 1./progress)) );
        }
    }

`;
