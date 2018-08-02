import {PieChartController} from './pieChartController.js';
const buttonAdd = buttonAddAndCrossHandler();
const buttonSubmit = buttonSubmitHadler();

function buttonAddAndCrossHandler() {
    const buttonAddBlock = document.getElementsByClassName('button_plus')[0];
    buttonAddBlock.addEventListener('click', function(event) {
        const buttonCreate = document.getElementsByClassName('submit')[0];
        const block = document.getElementsByClassName('data')[0];
        const dataContainer = document.getElementById('data_container');
        const newBlock = block.cloneNode(true);
        dataContainer.appendChild(newBlock);
        buttonCreate.style.display = 'block';
        const closeButton = newBlock.getElementsByClassName('cross')[0];
        closeButton.addEventListener('click', function(event){
            closeButton.parentElement.parentElement.remove();
            const blocks = document.getElementsByClassName('data');
            if (blocks.length < 3) buttonCreate.style.display = 'none';
        });
    });
}
function buttonSubmitHadler() {
    const buttonSubmit = document.getElementsByClassName('submit')[0];
    buttonSubmit.addEventListener('click', (event) => {
        submitHandler();
    });
}
function submitHandler () {
    const canvas = document.getElementById('canvas');
    const blocks = document.getElementsByClassName('data');
    let items = [];
    let correctData = true;
    
    for (let i = 1; i < blocks.length; i++) {
        const name = blocks[i].querySelector(".input_name input").value;
        const value = blocks[i].querySelector(".input_value input").value;
        const discr = blocks[i].querySelector(".description textarea").value;

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
        document.querySelector(".container_out").style.display = 'block';
        document.querySelector(".content").style.display = 'none';
        document.querySelector(".main_header").style.display = 'none';
        const pieChartController = new PieChartController(canvas, items);
    }
}
class Item {
    constructor(name, value, description) {
        this.id = name;
        this.value = parseFloat(value);
        this.description = description;
    }
}