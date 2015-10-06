#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float near(float val) {
    return smoothstep(-0.05, -0.02, -val) * smoothstep(-0.05, 0., val);
}

void main()
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 color = vec3(0.);

    float t2 = mod((time / 50.) + 0.03, 1.);
    float t3 = smoothstep(0., 0.8, t2) - smoothstep(0.8, 1., t2);

    vec2 diff = uv - vec2(0.5, 0.5);
    float l = cos((length(diff) - 0.3) * t3 * 500.);
    float l2 = cos((length(diff) - 0.4) * t3 * 500.);
    float l3 = cos((length(diff) - 0.5) * t3 * 500.);

    color.r += near(l);
    color.g += near(l2);
    color.b += near(l3);

    gl_FragColor = vec4(color, 1.0);
}
