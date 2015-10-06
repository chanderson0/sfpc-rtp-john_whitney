#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float nearZeroUV(float val) {
    return smoothstep(-0.05, 0., -val) * smoothstep(-0.05, 0., val);
}

float nearZeroXY(float val, float nearness) {
    return smoothstep(-nearness, 0., -val) * smoothstep(-nearness, 0., val);
}

void main()
{
    vec2 pos = gl_FragCoord.xy;
    vec2 uv = pos / resolution;
    vec2 center = resolution * 0.5;
    vec2 centerDiff = pos - center;

    float t2 = mod((time / 20.) + 0.03, 1.);
    float t3 = smoothstep(0., 0.5, t2) - smoothstep(0.5, 1., t2);

    vec3 color = vec3(0.);

    float a = 70.0, b = 100.0 + t3 * 4000.;
    float th = atan(centerDiff.y, centerDiff.x);
    float r = a - b * sin(th);

    color.r += nearZeroXY(cos((length(centerDiff) - r) / 80.), 2.);
    color.g += nearZeroXY(cos((length(centerDiff) - r) / 70.), 2.);
    color.b += nearZeroXY(cos((length(centerDiff) - r) / 60.), 2.);

    gl_FragColor = vec4(color, 1.);
}
