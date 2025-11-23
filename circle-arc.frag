#version 120
#define PI 3.14159265359
uniform float radialSmoothness, radius, borderThickness, progress;
uniform int change;
uniform vec4 color;
uniform vec2 pos;
void main() {
    vec2 st = gl_FragCoord.xy - (pos + radius + borderThickness);
    
    // 90度時計回りに回転: (x, y) -> (y, -x)
    vec2 rotated = vec2(st.y, -st.x);
    
    float circle = sqrt(dot(rotated, rotated));
    float smoothedAlpha = 1.0 - smoothstep(borderThickness, borderThickness + 3., abs(radius-circle));
    vec4 circleColor = vec4(color.rgb, smoothedAlpha * color.a);
    
    // 角度に PI/2 を加算して調整
    gl_FragColor = mix(vec4(circleColor.rgb, 0.0), circleColor, smoothstep(0., radialSmoothness, change * (atan(rotated.y, rotated.x) + PI/2.0 - (progress-.5) * PI * 2.5)));
}
