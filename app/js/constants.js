const CANVAS_WIDTH = 540;
const CANVAS_HEIGHT = 540;
const ANIMATION_DURATION = 200;
const ANIMATE_DY = CANVAS_HEIGHT / 12;
const RADIUS_CHART = setRadiusPieChart();

export {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    ANIMATION_DURATION,
    ANIMATE_DY,
    RADIUS_CHART
};

function setRadiusPieChart() {
    return CANVAS_WIDTH < CANVAS_HEIGHT
         ? CANVAS_WIDTH / 4
         : CANVAS_HEIGHT / 4;
}