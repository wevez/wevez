#version 120

#define PI 3.14159265359
#define ROTATION (-PI * 0.5)    // << hardcoded 90° clockwise rotation

uniform float radialSmoothness;
uniform float radius;
uniform float borderThickness;
uniform float progress;
uniform int change;
uniform vec4 color;
uniform vec2 pos;

// Rotation function
vec2 rotatePoint(vec2 p, float a) {
    float s = sin(a);
    float c = cos(a);
    return vec2(
        p.x * c - p.y * s,
        p.x * s + p.y * c
    );
}

void main() {
    // local coords relative to circle center
    vec2 st = gl_FragCoord.xy - (pos + radius + borderThickness);

    // apply hardcoded 90° clockwise rotation
    st = rotatePoint(st, ROTATION);

    float circle = sqrt(dot(st, st));

    float smoothedAlpha = 1.0 - smoothstep(
        borderThickness,
        borderThickness + 3.0,
        abs(radius - circle)
    );

    vec4 circleColor = vec4(color.rgb, smoothedAlpha * color.a);

    // progress arc angle (now rotated)
    float angle = atan(st.y, st.x);

    float mask = smoothstep(
        0.0,
        radialSmoothness,
        change * (angle - (progress - 0.5) * PI * 2.5)
    );

    gl_FragColor = mix(vec4(circleColor.rgb, 0.0), circleColor, mask);
}
