import {PieChart}  from './PieChart.js';
import {CANVAS_WIDTH, CANVAS_HEIGHT} from './constants.js';
import {mouseCoordinates, inRad, inDegrees} from './canvasFunctions.js';
const FONT = "italic 22pt Arial";

export class PieChartController {
    constructor(canvasElement, items) {
        this._canvas = canvasElement;
        this._ctx = canvasElement.getContext('2d')
        this._canvas.setAttribute('height', CANVAS_HEIGHT);
        this._canvas.setAttribute('width', CANVAS_WIDTH);
        this._ctx.font = FONT;
        this._canvas.addEventListener('mousedown', (e) => this._startRotating(e), false);
        document.addEventListener('mouseup', (e) => this._stopRotating(e), false);
        document.addEventListener('dragend', (e) => this._stopRotating(e), false);
        document.addEventListener('mousemove', (e) => this._rotating(e), false);

        this._pieChart = new PieChart();
        this._initPieChart(items);
        this._initButtons();
        
        const animation = () => {
            this._pieChart.animate(this._ctx);
            requestAnimationFrame(animation);
        };
        animation();
    }
    _initPieChart(items) {
        for (let i = 0; i < items.length; i++){
            this._pieChart.addItem(items[i]);
        };
        this._pieChart.draw(this._ctx);
    }
    _initButtons() {
        let next = document.getElementsByClassName('next')[0];
        let prev = document.getElementsByClassName('prev')[0];

        next.addEventListener('click', (event) => {
            this._pieChart.nextElement();
        });
        prev.addEventListener('click', (event) => {
            this._pieChart.prevElement();
        });
    }
    _startRotating(event) {
        this._pieChart.isRotating = true;
        const mousePos = mouseCoordinates(this._canvas, event);
        const angle = inDegrees(mousePos.x, mousePos.y);
        this._pieChart.setCurRotation(angle);
    }
    _rotating(event) {
        if (this._pieChart.isRotating) {
            const mousePos = mouseCoordinates(this._canvas, event);
            const angle = inDegrees(mousePos.x, mousePos.y);
            const prevCur = this._pieChart.getCurRotation();
            let currentAngle = angle - prevCur;
            if (currentAngle < 0) {
                currentAngle += 360;
            }
            this._pieChart.setRotation(inRad(currentAngle));
        }
    }
    _stopRotating(event) {
        const mouseMotion = 0.1;
        this._pieChart.isRotating = false;
        const mousePos = mouseCoordinates(this._canvas, event);
        const rotation = this._pieChart.getRotationDegree();
        if (rotation < mouseMotion || rotation > Math.PI * 2 - mouseMotion) {
            this._pieChart.activateElement(event, mousePos);
        };
        this._pieChart.resetRotation();
    }
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}