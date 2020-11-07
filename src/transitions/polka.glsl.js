// original author: bobylito
// license: MIT

export default `
    const float SQRT_2 = 1.414213562373;

    float dots = 20.0;
    vec2 center = vec2(0, 0);

    vec4 transition(vec2 uv) {
        bool nextImage = distance(fract(uv * dots), vec2(0.5, 0.5)) < ( progress / distance(uv, center));
        return nextImage ? getToColor(uv) : getFromColor(uv);
    }
`;
