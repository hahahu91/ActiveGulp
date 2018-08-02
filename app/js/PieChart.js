import {CANVAS_WIDTH, CANVAS_HEIGHT, ANIMATE_DY, RADIUS_CHART}  from './constants.js';
import {Item} from './Item.js';
import {arctg360, inRad, inDeg, getItemRect, showDescription, closeDescription} from './canvasFunctions.js';

const ITEMS_COLORS = ['#FF0000', '#800000', '#FFFF00', '#808000', '#00FF00', '#008000', '#00FFFF', '#008080', '#0000FF', '#000080', '#FF00FF'];

export class PieChart {
    constructor() {
        this._items = [];
        this._colors = ITEMS_COLORS;
        this._rotationDegree = 0;
        this.total = 0;
        this.isRotating = false;
        this._currentState = 1.5 * Math.PI;
        this._curRotation = 0;
    }
    addItem(item) {
        this._items.push(new Item(
            item.value, this._colors[this._items.length % this._colors.length], this._items.length, item.id, item.description
        ));
        this.total += item.value;
    }
    setRotation(degree) {
        this._rotationDegree = degree;
    }
    getRotationDegree() {
        return this._rotationDegree;
    }
    resetRotation() {
        this._currentState += this._rotationDegree;
        this._rotationDegree = 0;
    }
    setCurRotation(position) {
        this._curRotation = position;
    }
    getCurRotation() {
        return this._curRotation;
    }
    draw(canvasContext) {
        canvasContext.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        this._items.forEach((item, index) => {
            const itemRect = getItemRect(item, this._currentState + this._rotationDegree, this.total);
            const color = item.getColor();
            if (color == this._colors[0] && index == this._items.length - 1) { 
                item.setColor(this._colors[1]);
            }
            item.draw(canvasContext, this._currentState + this._rotationDegree, this.total);
            item.start = this._currentState;
            this._currentState += itemRect.rad;
            this._currentState = this._currentState % (2 * Math.PI);
            item.finish = this._currentState;
        });
    }
    animate(canvasContext) {
        this._items.forEach((item) => {
            let isAnimate = item.isAnimate();
            if (isAnimate) {
                item.animate();
                this.draw(canvasContext);
            }
        });
        this.setRotation && this.draw(canvasContext);
    }
    activateElement(event, mousePos) {
        const distance = Math.hypot(mousePos.x, mousePos.y);
        if (distance <= (RADIUS_CHART + ANIMATE_DY)) {
            this._items.forEach((item) => {
                const click = item.check(distance, this.total, mousePos);
                click && this._processElementClick(this._items, item);
            });
        }
    }
    nextElement() {
        let isActiveIndex = 0;
        this._items.forEach((item, index) => {
            if (item.isActive()) {
                if (index == this._items.length - 1) isActiveIndex = 0;
                else isActiveIndex = index + 1;
            }
        });
        this._processElementClick(this._items, this._items[isActiveIndex]);
    }
    prevElement() {
        let isActiveIndex = this._items.length - 1;
        this._items.forEach((item, index) => {
            if (item.isActive()) {
                if (index == 0)  isActiveIndex = this._items.length - 1;
                else isActiveIndex = index - 1;
            }
        });
        this._processElementClick(this._items, this._items[isActiveIndex]);
    }
    _processElementClick(items, clickedItem) {
        items.forEach((item, index) => {
            const isActive = item.isActive();

            if (item == clickedItem) {
                if (isActive) {
                    item.deactivate();
                    closeDescription();
                }
                else  {
                    item.activate();
                    showDescription(item);
                }
            }
            else if (isActive) {
                item.deactivate();
            }
        });
    }
}




