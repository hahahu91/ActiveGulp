import {CANVAS_WIDTH, CANVAS_HEIGHT, ANIMATION_DURATION, ANIMATE_DY, RADIUS_CHART}  from './constants.js';
import {Animation} from './Animation.js';
import {arctg360, mouseCoordinates, inRad, inDeg, getItemRect} from './canvasFunctions.js';
import {TimingFunctions} from './TimingFunctions.js';

export class Item {
    constructor(value, color, index, id, description) {
        this.id = id;
        this.index = index;
        this.value = value;
        this.description = description;
        this._color = color;
        this._animation = new Animation(this, TimingFunctions.easeInOutQuad);
        this.start = null;
        this.finish = null;
        this._isActive = false;
    }
    isActive() {
        return this._isActive;
    }
    getCurAnimation() {
        return this._animation.getCurAnimate();
    }
    isAnimate() {
        return this._animation.isAnimation();
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
    animate() {
        this._animation.animate();
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
            let curAnimate = this._animation.isAnimation();
            if (!curAnimate) {
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