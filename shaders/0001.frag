#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main()
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 color = vec3(0.);

    float t2 = mod(time / 10., 1.);
    float t3 = smoothstep(0., 0.5, t2) - smoothstep(0.5, 1., t2);
    
    float sinValX = sin(uv.x * t3 * 100. + t3 * 4.) * 0.15 + 0.5;
    float distSinY = uv.y - sinValX;
    color.r += smoothstep(-0.05, -0.02, -distSinY) * smoothstep(-0.05, 0., distSinY);
    
    float cosValX = cos(uv.x * t3 * 100. + t3 * 4. * 2.) * 0.15 + 0.5;
    float distCosY = uv.y - cosValX;
    color.g += smoothstep(-0.05, -0.02, -distCosY) * smoothstep(-0.05, 0., distCosY);
    
    float cosValX2 = cos(uv.x * t3 * 100. + t3 * 4. * 3.) * 0.15 + 0.5;
    float distCosY2 = uv.y - cosValX2;
    color.b += smoothstep(-0.05, -0.02, -distCosY2) * smoothstep(-0.05, 0., distCosY2);
    
    gl_FragColor = vec4(color, 1.0);
}
 