var buttonAddBlock = document.getElementsByClassName('button_plus')[0];
var block = document.getElementsByClassName('data')[0];
var dataCollector = document.getElementById('data_container');
var buttonSubmit = document.getElementsByClassName('submit')[0];
var items = [];
import {getStart} from 'canvasOnClasses.js';

class Item {
    constructor(name, value, description) {
        this.id = name;
        this.value = value;
        this.description = description;
    }
}

buttonAddBlock.addEventListener('click', function(event) {
    event.preventDefault();
    var newBlock = block.cloneNode(true);
    dataCollector.appendChild(newBlock);
    var closeButton = newBlock.getElementsByClassName('cross')[0];
    closeButton.addEventListener('click', function(event){
        closeButton.parentElement.parentElement.remove();
    });
});

buttonSubmit.addEventListener('click', function(event) {
    event.preventDefault();
    let blocks = document.getElementsByClassName('data');
    let correctData = true; 
    for (var i = 1; i < blocks.length; i++) {
        var name = blocks[i].querySelector(".input_name input").value;
        var value = blocks[i].querySelector(".input_value input").value;

        var discr = blocks[i].querySelector(".description textarea").value;
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
    }
})