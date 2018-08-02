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

function arctg360(x, y) {
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
    let margin = canvas.getBoundingClientRect();
    let tempX = event.pageX - margin.left;
    let tempY = event.pageY - margin.top;
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

function showDescription(item) {
    let decrDiv = document.getElementById('decription'); 
    let title = document.getElementsByClassName('title')[0];
    let paragraph = document.getElementsByClassName('about_item')[0];
    let color = item.getColor();
    
    if (decrDiv.classList.contains('active')) {
        decrDiv.classList.remove('active');
        setTimeout(function(){
            decrDiv.classList.add('active');
            decrDiv.style.borderTopColor = color;
            title.innerHTML = item.id;
            paragraph.innerHTML = 'value: '+item.value+'<Br>'+item.description;
        }, 300)
    }
    else {
        decrDiv.classList.add('active');
        decrDiv.style.borderTopColor = color;
        title.innerHTML = item.id;
        paragraph.innerHTML = 'value: '+item.value+'<Br>'+item.description;
    }
}

function closeDescription() {
    let decrDiv = document.getElementById('decription');
    decrDiv.classList.remove('active');
}

export {
    arctg360,
    mouseCoordinates,
    inRad,
    inDeg,
    getItemRect,
    showDescription,
    closeDescription,
};