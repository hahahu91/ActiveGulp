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
    showDescription,
    closeDescription,
}