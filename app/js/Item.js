import {CANVAS_WIDTH, CANVAS_HEIGHT, ANIMATION_DURATION, ANIMATE_DY, RADIUS_CHART}  from './constants.js';
import {Animation} from './Animation.js';
import {arctg360, mouseCoordinates, inRad, inDeg, getItemRect} from './functions.js';

export class Item {
    constructor(value, color, index, id, description) {
        this.id = id;
        this.index = index;
        this.value = value;
        this.description = description;
        this._color = color;
        this._animation = new Animation(this, EasingFunctions.easeInQuad);
        this.start = null;
        this.finish = null;
        this._isActive = false;
    }
    
    isActive() {
        return this._isActive;
    }
    
    setActive(isActive) {
        this._isActive = isActive;
    }
    
    setColor(color) {
        this._color = color;
    }
    
    getColor() {
        return this._color;
    }
    
    draw(canvasContext, rotationDegree, totalValue) {
        const itemRect = getItemRect(this, rotationDegree, totalValue);
        canvasContext.fillStyle = this._color;
        canvasContext.shadowOffsetX = 0;
        canvasContext.shadowOffsetY = 0;
        canvasContext.shadowBlur = 25;
        canvasContext.shadowColor = 'rgba(30,30,30, 0.4)';
        
        canvasContext.beginPath();
        canvasContext.arc(itemRect.x, itemRect.y, RADIUS_CHART, rotationDegree, rotationDegree + itemRect.rad, false);
        canvasContext.lineTo(itemRect.x, itemRect.y);
        canvasContext.closePath();
        canvasContext.stroke();
        canvasContext.fill();
        const text = `${Math.round(100 * this.value / totalValue)}%`;
        canvasContext.shadowBlur = 0;
        this._writePercentages(canvasContext, text, itemRect.cx, itemRect.cy);
    }

    animation() {
        return this._animation;
    }
    
    activate() {
        this._animation.activate();
        this._isActive = true;
    }
    
    deactivate() {
        this._animation.deactivate();
        this._isActive = false;
    }
    
    check(distance, totalValue, mousePos) {
        const angle = inRad(arctg360(mousePos.x, mousePos.y));
        if ((angle >= this.start && angle < this.finish) || ((this.start > this.finish) && (angle >= this.start || angle < this.finish) )) {
            let curAnimate = this.animation();
            if (!curAnimate.isAnimation) {
                if (this._isActive) {
                    return this._activElementCheck(this, totalValue, mousePos);
                }
                else return (distance <= RADIUS_CHART);
            }
            else return false;
        }
        return false;
    }
    _activElementCheck(item, totalValue, mousePos) {
        const rect = getItemRect(item, item.start, totalValue);
        const activeX = mousePos.x - rect.x + CANVAS_WIDTH / 2;
        const activeY = mousePos.y - rect.y + CANVAS_HEIGHT / 2;
        const distance = Math.hypot(activeX, activeY);
        const angle = inRad(arctg360(activeX, activeY));

        return (((item.start <= angle && angle < item.finish) || (item.start > item.finish) && (item.start <= angle || angle < item.finish)) && distance <= RADIUS_CHART)
    }
    _writePercentages(ctx, text, x, y) {
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#808080';
        ctx.fillText(text, x, y);
    }
};

const EasingFunctions = {
  linear: function (t) { return t },
  easeInQuad: function (t) { return t*t },
  easeOutQuad: function (t) { return t*(2-t) },
  easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  easeInCubic: function (t) { return t*t*t },
  easeOutCubic: function (t) { return (--t)*t*t+1 },
  easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  easeInQuart: function (t) { return t*t*t*t },
  easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  easeInQuint: function (t) { return t*t*t*t*t },
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
}