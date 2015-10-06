#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795

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
    float th = atan(centerDiff.y, centerDiff.x);

    float t2 = mod((time / 10.), 1.);
    float t3 = smoothstep(0., 0.5, t2) - smoothstep(0.5, 1., t2);

    float t4 = mod((time / 20.), 1.);
    float t5 = smoothstep(0., 0.5, t4) - smoothstep(0.5, 1., t4);

    vec3 color = vec3(0.);

    for (int i = 0; i < 5; ++i) {
        float a = 30.0, b = 0.0 + t3 * 100.;
        float r = a - b * (1.0 / sin(th + float(i) * M_PI));
        color.r += nearZeroXY((length(centerDiff) - r), 5.);
    
        float r2 = sin(th + float(i) * M_PI) * t5 + sin(5. * t5 * 10. * th / 2. + float(i) * M_PI);
        color.g += nearZeroXY((length(centerDiff) - r2 * 50.), 5.);
    }

    gl_FragColor = vec4(color, 1.);
}
