//const canvas = document.getElementById('canvas');
//const buttonAddBlock = document.getElementsByClassName('button_plus')[0];
//const block = document.getElementsByClassName('data')[0];
//const dataCollector = document.getElementById('data_container');
//const buttonSubmit = document.getElementsByClassName('submit')[0];

import {PieChartController} from './canvasOnClasses.js';

class DataCollector {
    constructor(){
        this._canvas = document.getElementById('canvas');
        this._buttonAddAndCrossHandler();
        this._dataCollector = document.getElementById('data_container');
        this._buttonSubmit();
    }
    _buttonAddAndCrossHandler() {
        let buttonAddBlock = document.getElementsByClassName('button_plus')[0];
        buttonAddBlock.addEventListener('click', function(event) {
            event.preventDefault();
            let block = document.getElementsByClassName('data')[0];
            let dataCollector = document.getElementById('data_container');
            let newBlock = block.cloneNode(true);
            dataCollector.appendChild(newBlock);
            let closeButton = newBlock.getElementsByClassName('cross')[0];
            closeButton.addEventListener('click', function(event){
                closeButton.parentElement.parentElement.remove();
            });
        });
    }
    _buttonSubmit() {
        let buttonSubmit = document.getElementsByClassName('submit')[0];
        buttonSubmit.addEventListener('click', (event) => {
            event.preventDefault();
            this._submitHandler();
        });
    }
    _submitHandler () {
        let blocks = document.getElementsByClassName('data');
        let items = [];
        let correctData = true;

        for (let i = 1; i < blocks.length; i++) {
            let name = blocks[i].querySelector(".input_name input").value;
            let value = blocks[i].querySelector(".input_value input").value;
            let discr = blocks[i].querySelector(".description textarea").value;

            if (!value)  {
                blocks[i].querySelector(".input_value input").classList.add('error');
                correctData = false;
            }
            else {
                blocks[i].querySelector(".input_value input").classList.remove('error');
                (value) && items.push(new Item(name, value, discr));
            }
        };
        if (correctData && items.length > 0) {
            document.querySelector(".main_container").style.display = 'block';
            document.querySelector(".content").style.display = 'none';
            const pieChartController = new PieChartController(this._canvas, items);
        }
    }
}

class Item {
    constructor(name, value, description) {
        this.id = name;
        this.value = parseInt(value);
        this.description = description;
    }
}

const dataCollector = new DataCollector();