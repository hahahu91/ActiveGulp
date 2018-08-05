import {CANVAS_WIDTH, CANVAS_HEIGHT, ANIMATE_DY, RADIUS_CHART}  from './constants.js';
import {Item} from './Item.js';
import {getItemRect} from './canvasFunctions.js';
import {showDescription, closeDescription} from './descriptionFunctions.js';

const ITEMS_COLORS =    ["#ef3c42",  "#a7d52a",  "#4b27bd",  "#f6c137",  "#4592ca",
                        "#f25e40",  "#79c725",  "#7328b6",  "#fad435",  "#3f77c4",
                        "#f2823a",  "#53c025",  "#b528c5",  "#fdf32f",  "#3a57bf",
                        "#f69537",  "#52c67f",  "#c32a94",  "#ffff2d",  "#3457bf",
                        "#f4aa2f",  "#4daecf",  "#dd3371",  "#dff429",  "#3438bd",];

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
                if (index == this._items.length - 1) {
                    isActiveIndex = 0;
                }
                else {
                    isActiveIndex = index + 1;
                }
            }
        });
        this._processElementClick(this._items, this._items[isActiveIndex]);
    }
    prevElement() {
        let isActiveIndex = this._items.length - 1;
        this._items.forEach((item, index) => {
            if (item.isActive()) {
                if (index == 0)  {
                    isActiveIndex = this._items.length - 1;
                }
                else {
                    isActiveIndex = index - 1;
                }
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




