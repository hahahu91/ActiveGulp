import {PieChart}  from './PieChart.js';
import {CANVAS_WIDTH, CANVAS_HEIGHT} from './constants.js';
import {mouseCoordinates, inRad, arctg360} from './functions.js';

export class PieChartController {
    constructor(canvasEl, data) {
        this._canvas = canvasEl;
        this._ctx = canvasEl.getContext('2d')
        this._canvas.setAttribute('height', CANVAS_HEIGHT);
        this._canvas.setAttribute('width', CANVAS_WIDTH);
        this._ctx.font = '10px Arial';

        this._canvas.addEventListener('mousedown', (e) => this._startRecalculation(e), false);
        document.addEventListener('mouseup', (e) => this._stopRecalculation(e), false);
        document.addEventListener('dragend', (e) => this._stopRecalculation(e), false);
        document.addEventListener('mousemove', (e) => this._recalculation(e), false);

        this._pieChart = new PieChart();
        this._initPieChart(data);
        this._initButtons();
        
        
        const animateFn = () => {
            this._pieChart.animate(this._ctx);
            requestAnimationFrame(animateFn);
        };
        animateFn();
    }
    
    _initPieChart(data) {
        for (let i = 0; i < data.length; i++){
            this._pieChart.addItem(data[i]);
        };
        this._pieChart.draw(this._ctx);
    }
    
    _initButtons() {
        let next = document.getElementsByClassName('next')[0];
        let prev = document.getElementsByClassName('prev')[0];

        next.addEventListener('click', (event) => {
            event.preventDefault();
            this._pieChart.nextElem();
        });
        prev.addEventListener('click', (event) => {
            event.preventDefault();
            this._pieChart.prevElem();
        });
    }
    
    _startRecalculation(event) {
        this._pieChart.isRecalculation = true;
        let mousePos = mouseCoordinates(this._canvas, event);
        const angle = arctg360(mousePos.x, mousePos.y);
        this._pieChart.setCurRotation(angle);
    }

    _recalculation(event) {
        if (this._pieChart.isRecalculation == true) {
            const mousePos = mouseCoordinates(this._canvas, event);
            const angle = arctg360(mousePos.x, mousePos.y);
            const prevCur = this._pieChart.getCurRotation();
            let currentAngle = angle - prevCur;
            if (currentAngle < 0)
                currentAngle += 360;
            this._pieChart.setRotation(inRad(currentAngle));
        }
    }

    _stopRecalculation(event) {
        const mouseMotion = 0.1;
        this._pieChart.isRecalculation = false;
        let mousePos = mouseCoordinates(this._canvas, event);
        let rotation = this._pieChart.getRotationDegree();
        if (rotation < mouseMotion || rotation > Math.PI * 2 - mouseMotion) {
            this._pieChart.activateElement(event, mousePos);
        };
        this._pieChart.resetRotation();
    }
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}