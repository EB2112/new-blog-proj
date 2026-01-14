

document.addEventListener('DOMContentLoaded', () =>{
    loadgame()
    
})

var score = 0;
var methods = {
    postScheduler: 0,
    twitterBot: 0,
    targetedAds: 0,
    aiSlop: 0,
    snarkerSubreddit: 0
}
methodRates= {
postScheduler: 1 ,
    twitterBot: 5,
    targetedAds: 25,
    aiSlop: 125,
    snarkerSubreddit: 625
}
let ui;


const methodCosts = {
    postScheduler : () =>
        Math.floor(10 * Math.pow(1.12, methods.postScheduler)),
    twitterBot: () => 
        Math.floor(120 * Math.pow(1.12, methods.twitterBot)),
    targetedAds: () =>
         Math.floor(1500 * Math.pow(1.12, methods.targetedAds)),
     aiSlop: () =>
         Math.floor(18000 * Math.pow(1.12, methods.targetedAds)),
      snarkerSubreddit: () =>
         Math.floor(220000 * Math.pow(1.12, methods.targetedAds)),

}
const buttons = document.querySelectorAll(".methodBuy")
console.log(buttons)
const counts = document.querySelectorAll(".methodCount")
const getByID = id => document.getElementById(id)

var trollText = []


 function initUI(){
    let uiComps = {}
    buttons.forEach((b)=>{uiComps[b.id]= document.getElementById(b.id)})
    buttons.forEach((button) =>{
        button.querySelector(".cost").innerText= `${methodCosts[button.dataset.method]()}`
        button.addEventListener('click', () =>{
            buyMethod(button.dataset.method)
            refreshUI(button.querySelector(".methodCount"))
        })
    })
    counts.forEach((c)=>{uiComps[c.id]= document.getElementById(c.id)})
    counts.forEach((c) =>{c.innerText = `${methods[c.parentElement.dataset.method]}`})
    ui={
        ...uiComps,
    scoreDisplay : getByID('scoreDisplay'),
    scoreRate: getByID('scoreRate'),
    }
    ui.scoreDisplay.innerText = `Engagement: ${score}`
    ui.scoreRate.innerText= `Engagement per second: ${Math.floor(scorePerSecond().toFixed(1))}`
}

function saveGame(){
    var save = {
        score: score,
        postScheduler : methods.postScheduler,
        twitterBot : methods.twitterBot,
        targetedAds: methods.targetedAds
    }
    localStorage.setItem('save', JSON.stringify(save))
    console.log('saved!')
}

function loadgame(){
    
    var savedGame = JSON.parse(localStorage.getItem('save'))
    if(savedGame){
    if(typeof savedGame.score !== 'undefined') score = savedGame.score
    if(typeof savedGame.postScheduler !== 'undefined') methods.postScheduler = savedGame.postScheduler
    if(typeof savedGame.twitterBot !== 'undefined')methods.twitterBot = savedGame.twitterBot 
    initUI()
}else{
    return
}
}

// function updateUI(){
//     initUI()
//     for(let count of counts){
//         refreshUI(count)
//     }
//     // ui.schedulerCount.innerText = `${methods.postScheduler}`
//     // ui.twitterBotCount.innerText = `${methods.twitterBot}`
//     // ui.targetedAdsCount.innerText = `${methods.targetedAds}`
//     ui.scoreDisplay.innerText = `Engagement: ${score}`
//     ui.scoreRate.innerText= `Engagement per second: ${Math.floor(scorePerSecond().toFixed(1))}`
   
// }

function refreshUI(component){
   component.innerText = `${methods[component.parentElement.dataset.method]}`
}
function increment(num){
    score = score + num
    ui.scoreDisplay.innerText = `Engagement: ${score}`
}

function scrollTerminal(){
    const terminalLines = document.querySelectorAll(".terminalLine")
    for (let i = 0; i < terminalLines.length - 1; i++) {
        terminalLines[i].innerText = terminalLines[i + 1].innerText;
    }
    terminalLines[5].innerText = `> ${trollText[Math.floor(Math.random() * trollText.length)]}`;
}


function buyMethod(methodName){
    var methodCost = methodCosts[methodName]()
    if(score >=  methodCost){
        methods[methodName] ++;
        score -= methodCost;
    
       console.log(scorePerSecond()) 
      
}
}

function scorePerSecond() {
    let total = 0; 
    for (let m of Object.keys(methods)) {
        total = total + methods[m] *( methodRates[m] / 10);
    }
    return total;
}

let scoreFloat = 0;
const SCORE_TICK_RATE = 50
const TERMINAL_TICK_RATE = 200

//function to make the score counter go up smoothly instead of choppy batches
window.setInterval(function(){
    
    scoreFloat += scorePerSecond() * (SCORE_TICK_RATE/ 1000);
    ui.scoreRate.innerText = `Engagement per second: ${scorePerSecond().toFixed(1)}`;
    const gained = Math.floor(scoreFloat);
    if(gained > 0){
        score += gained
        scoreFloat -= gained
        ui.scoreDisplay.innerText = `Engagement: ${score}`;

    } 
}, SCORE_TICK_RATE)

//function to start auto sending messages to the terminal once you unlock methods
window.setInterval(function(){
    scoreFloat += scorePerSecond() * (TERMINAL_TICK_RATE/ 10000);
    const gained = Math.floor(scoreFloat);
    if(gained > 0){
        
        scoreFloat -= gained
        scrollTerminal()
    } 
},
 TERMINAL_TICK_RATE  
)
window.setInterval(saveGame,
10000)
