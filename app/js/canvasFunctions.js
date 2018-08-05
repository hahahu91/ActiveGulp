import {CANVAS_WIDTH, CANVAS_HEIGHT, ANIMATION_DURATION, ANIMATE_DY, RADIUS_CHART}  from './constants.js';

function getItemRect(item, start, total) {
    const radians = (Math.PI * 2) * (item.value / total);
    const center = CANVAS_WIDTH / 2;
    const middle = (start + start + radians) / 2;
    const curAnimation = item.getCurAnimation();
    const distanceText = RADIUS_CHART + 45 + curAnimation;
    
    return {
        rad: radians,
        cx: center + (distanceText) * Math.cos(middle),
        cy: center + (distanceText) * Math.sin(middle),
        x: center + (curAnimation) * Math.cos(middle),
        y: center + (curAnimation) * Math.sin(middle),
    };
}

function inDegrees(x, y) {
    if (y >= 0 && x >= 0) {
        return Math.atan(y / x) * 180 / Math.PI;
    }
    else if (y >= 0 &&  x < 0 || y < 0 && x < 0) {
        return 180 + Math.atan(y / x) * 180 / Math.PI;
    }
    else {
        return 360 + Math.atan(y / x) * 180 / Math.PI;
    };
}

function mouseCoordinates(canvas, event) {
    const margin = canvas.getBoundingClientRect();
    const tempX = event.pageX - margin.left;
    const tempY = event.pageY - margin.top;
    return {
        x: tempX - CANVAS_WIDTH / 2,
        y: tempY - CANVAS_HEIGHT / 2,
    }
}

function inRad(degrees) {
    return degrees * Math.PI / 180;
}

function inDeg(radians) {
    return radians * 180 / Math.PI;
}

export {
    inDegrees,
    mouseCoordinates,
    inRad,
    inDeg,
    getItemRect,
};