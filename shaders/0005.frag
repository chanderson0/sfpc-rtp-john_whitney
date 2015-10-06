// Apologies for the spaghetti code

#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795

uniform float time;
uniform vec2 resolution;

// From http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand(vec2 co) {
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

vec3 random3(int seed) {
    return vec3(
        rand(vec2(float(seed + 1000), float(seed + 5000))),
        rand(vec2(float(seed + 2000), float(seed + 6000))),
        rand(vec2(float(seed + 3000), float(seed + 7000)))
    );
}

float random1(int seed) {
    return rand(vec2(float(seed + 50231), float(seed + 12314)));
}

// From https://dl.dropboxusercontent.com/u/68698001/projplot/index.html
float f(vec3 p, vec3 c) {
    return c[0] * p.x*p.z*p.z*p.z + c[1] * p.x*p.x*p.x*p.y + c[2] * p.y*p.y*p.y*p.z;
}

float nearZero(float val, float nearness) {
    return smoothstep(-nearness, 0., -val) * smoothstep(-nearness, 0., val);
}

void main() {
    float scale = 10.;

    vec2 pos = gl_FragCoord.xy;
    vec2 uv = scale * 2.0 * pos / resolution - vec2(scale, scale);
    vec2 center = resolution * 0.5;
    vec2 centerDiff = pos - center;
    float th = atan(centerDiff.y, centerDiff.x);

    float totalTime = 15.;
    float t2 = mod((time / totalTime), 1.);
    float t3 = smoothstep(0., 0.5, t2) - smoothstep(0.5, 1., t2);

    int seed = int(floor((time + totalTime / 2.0) / totalTime)) * int(totalTime);

    vec3 color = vec3(0.);

    float f1 = f(vec3(uv, t3 * 10. - 10.),
                 vec3(random1(seed + 0) * 50. - 25.,
                      random1(seed + 1) * 50. - 25.,
                      random1(seed + 2) * 50. - 25.));
    vec3 c1 = random3(seed);

    color = mix(color, c1,
                nearZero(sin(f1 / 10000. + random1(seed + 0) * 0.2), random1(seed + 19) * 0.2));

    float f2 = f(vec3(uv, t3 * 10. - 10.),
                 vec3(random1(seed + 4) * 50. - 25.,
                      random1(seed + 5) * 50. - 25.,
                      random1(seed + 6) * 50. - 25.));
    vec3 c2 = random3(seed + 1);
    color = mix(color, c2,
                nearZero(sin(f2 / 10000. + random1(seed + 1) * 0.2), random1(seed + 25) * 0.2));

    float f3 = f(vec3(uv, t3 * 10. - 10.),
                 vec3(random1(seed + 7) * 50. - 25.,
                      random1(seed + 8) * 50. - 25.,
                      random1(seed + 9) * 50. - 25.));
    vec3 c3 = random3(seed + 2);
    color = mix(color, c3,
                nearZero(f3, 500.));

    gl_FragColor = vec4(color, 1.);
}
