#ifdef GL_ES
precision mediump float;
#endif

#define M_PI 3.1415926535897932384626433832795
#define XY_SCALE 5.0
#define TIME_SCALE 15.
#define TIME_SCALE_INT 15

uniform float time;
uniform vec2 resolution;

// From http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
float rand(vec2 co) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt= dot(co.xy ,vec2(a,b));
    float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

vec3 random3(int seed) {
    return vec3(
        rand(vec2(float(seed + 383), float(seed + 389))),
        rand(vec2(float(seed + 397), float(seed + 401))),
        rand(vec2(float(seed + 409), float(seed + 419)))
    );
}

vec2 random2(int seed) {
    return vec2(
        rand(vec2(float(seed + 383), float(seed + 389))),
        rand(vec2(float(seed + 397), float(seed + 401)))
    );
}

float random1(int seed) {
    return rand(vec2(float(seed + 383), float(seed + 389)));
}

// // https://gist.github.com/patriciogonzalezvivo/114c1653de9e3da6e1e3
vec3 rgb2hsv(vec3 c){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 0.000000000001;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb( in vec3 c ){
    vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
    return c.z * mix( vec3(1.0), rgb, c.y);
}

float lineDist(vec2 v, vec2 w, vec2 p) {
    // Return minimum distance between line segment vw and point p
    float l2 = pow(distance(v, w), 2.);  // i.e. |w-v|^2 -  avoid a sqrt
    if (l2 == 0.0)
        return distance(p, v);   // v == w case
    // Consider the line extending the segment, parameterized as v + t (w - v).
    // We find projection of point p onto the line. 
    // It falls where t = [(p-v) . (w-v)] / |w-v|^2
    float t = dot(p - v, w - v) / l2;
    if (t < 0.0)
        return distance(p, v);       // Beyond the 'v' end of the segment
    else if (t > 1.0)
        return distance(p, w);  // Beyond the 'w' end of the segment
    vec2 projection = v + t * (w - v);  // Projection falls on the segment
    return distance(p, projection);
}

float nearZero(float val, float nearness) {
    return smoothstep(-nearness, 0., -val) * smoothstep(-nearness, 0., val);
}

void main() {
    vec2 pos = gl_FragCoord.xy;
    vec2 center = resolution * 0.5;
    vec2 centerDiff = (pos - center) / 30.;
    //float th = atan(centerDiff.y, centerDiff.x);

    // Map onto (-XY_SCALE, XY_SCALE)
    vec2 uv = XY_SCALE * 2.0 * pos / resolution - vec2(XY_SCALE, XY_SCALE);

    float t2 = mod((time / TIME_SCALE), 1.);
    float t3 = smoothstep(0., 0.5, t2) - smoothstep(0.5, 1., t2);

    int period = int(floor(time / TIME_SCALE));
    int seed = period * 7793;
    int nextSeed = (period+ 1) * 7793;

    vec3 color = vec3(0.);
    vec3 c1 = random3(seed);
    vec3 c2 = random3(nextSeed);
    vec3 c = mix(c1, c2, t2);
    c = rgb2hsv(c);
    c.g = 1.0; c.b = 1.0;
    c = hsv2rgb(c);

    float A = 4.0, B = 3.0;
    float a = 3.0, b = 1.0;
    float delta = 1.0;

    float minDist = 100.0;
    for (int i = 0; i < 63; ++i) {
        float t0 = float(i) / 10.0;
        float t1 = float(i+1) / 10.0;

        float x0 = A * sin(a * t0 + delta + t3 * M_PI * 2. * 2.);
        float y0 = B * sin(b * t0);

        float x1 = A * sin(a * t1 + delta + t3 * M_PI * 2.);
        float y1 = B * sin(b * t1);

        float dist = lineDist(vec2(x0, y0), vec2(x1, y1), centerDiff);
        minDist = min(dist, minDist);
    }

    color = mix(
            color,
            c,
            nearZero(
                minDist,
                0.17
            )
        );

    gl_FragColor = vec4(color, 1.);
}
