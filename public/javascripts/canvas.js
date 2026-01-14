const canvas = document.querySelector("#canvas");
const colors = document.querySelectorAll(".color"); 
const sliders = document.querySelectorAll(".slider")
const numInputs = document.querySelectorAll(".number")
const context = canvas.getContext("2d");
const colorPreview = document.getElementById('colorpreview')
const tools = document.querySelectorAll(".tool")
const resetButton = document.getElementById("resetbutton")
const size = document.getElementById("canvassize")
const thickness = document.getElementById("thickness")
const thicklabel= document.getElementById("brushsize")

const testimg = document.getElementById('image')

context.fillStyle = "white";

let isDrawing = false;
let currentMode = 'freedraw';
let currentColor = 'red';
let coords = {x: 0, y:0};
let startPos = {x:0, y:0};
let endPos = {x:0, y:0};
let data = {start: null, end: null, color: currentColor, size: null }
console.log("Script loaded, waiting for window load…");
window.addEventListener("DOMContentLoaded" ,() => {
   
    

    sliders.forEach((slider) => {
        if(slider.id == "alpha"){
            slider.value = 1;
        }
        else{
        slider.value=0;
        }
        document.getElementById(`${slider.id}value`).value = slider.value
    } )
    thickness.value = 5
  colorPreview.style.backgroundColor = grabColor()
});



resetButton.addEventListener("click", () =>{
    context.reset()
    console.log('reset')

    

})

size.addEventListener('change', ()=>{
    console.log("change")
  setSize(size.value, size.value)
});

thickness.addEventListener("input", ()=>{
    thicklabel.innerText=thickness.value
    
})



canvas.addEventListener("mousedown",startDrawing);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mousemove", freeDraw);



 sliders.forEach((slider) =>{
    slider.addEventListener('input', ()=>{
        document.getElementById(`${slider.id}value`).value = slider.value
        colorPreview.style.backgroundColor = grabColor()
    })});


tools.forEach((tool) =>{
    tool.addEventListener('click', () =>{
        currentMode = tool.value;
    })
})






function grabColor(){
const redValue =  document.getElementById("redvalue").value;
const greenValue =  document.getElementById("greenvalue").value;
const blueValue =  document.getElementById("bluevalue").value;
const alphaValue =  document.getElementById("alphavalue").value;

return(`rgba(${redValue},${greenValue},${blueValue},${alphaValue})`)

}


//gets position of mouse within canvas
function getPosition(event){
    const bounding = canvas.getBoundingClientRect();
    coords.x = event.clientX - bounding.left;
    coords.y = event.clientY - bounding.top;
}

function setSettings(){
    context.lineWidth = thickness.value;
    context.lineCap = 'round';
    context.strokeStyle = grabColor();
}
function startDrawing(event){
    isDrawing = true;
    getPosition(event)
    if (currentMode == "line" || currentMode == "rect") start(event);
    
}

function stopDrawing(event){
    isDrawing = false;
    if (currentMode == "line") straightLineEnd(event);
    if (currentMode == "rect") rectangleEnd(event);
    
}

function setSize(){
    
    canvas.setAttribute("width", size.value);
    canvas.setAttribute("height", size.value);
    canvas.style.width = size.value;
    canvas.style.height = size.value;
    let canvasSize = {width: size.value, height: size.value};
    
    console.log(canvas)
} 

//WOP need to refactor. Takes position of initial click and draws line to new position. Also creates data object to emit to other clients
// when called with mousehover event, it constantly draws, acting like a free drawing mode 
function freeDraw(event){
    if(!isDrawing) return;
    if(currentMode != "freedraw") return;
    context.beginPath();
    setSettings()
    let oldPos = {x: coords.x, y: coords.y}
    getPosition(event);
    context.moveTo(oldPos.x, oldPos.y);
    context.lineTo(coords.x, coords.y)
    context.stroke();
    data = {start: oldPos, end: coords, color: grabColor(), size: thickness.value};
   
}
//function to draw with data given from other clients
function drawLine(start, end, color, size) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = size;
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
}

//gets starting position of line
function start(event){
    if(!isDrawing) return;
    getPosition(event);
    startPos = {x: coords.x, y: coords.y};
    
}

//gets ending position of line and connects with the starting position
function straightLineEnd(event){
    
    getPosition(event);
    endPos = {x: coords.x, y: coords.y};
    context.beginPath();
    setSettings()
    context.moveTo(startPos.x, startPos.y);
    context.lineTo(endPos.x, endPos.y)
    context.stroke();
}

function drawRect(startPos, endPos){
    context.strokeRect(startPos.x, startPos.y, 
    Math.abs(startPos.x - endPos.x), Math.abs(startPos.y - endPos.y))

    
}

function rectangleEnd(event){
    getPosition(event);
    endPos = {x: coords.x, y: coords.y};
    context.beginPath();
    setSettings();
    drawRect(startPos, endPos);
 }




async function showCanvas(id){
    const response = await fetch(`http://localhost:3000/show/${id}`)
    const data = await response.json();
    console.log(data)
   testimg.src = `data:image/png;base64,${data.imageData}`;
}