
document.addEventListener('DOMContentLoaded', () =>{
    loadgame(),
    initUI()
})

var score = 0;
var methods = {
    postScheduler: 0,
    twitterBot: 0,
    targetedAds: 0
}
methodRates= {
postScheduler: 1 ,
    twitterBot: 5,
    targetedAds: 25
}
let ui;


const methodCosts = {
    postScheduler : () =>
        Math.floor(10 * Math.pow(1.12, methods.postScheduler)),
    twitterBot: () => 
        Math.floor(120 * Math.pow(1.12, methods.twitterBot)),
    targetedAds: () =>
         Math.floor(1500 * Math.pow(1.12, methods.targetedAds))
}
const buttons = document.querySelectorAll("button")
const counts = document.querySelectorAll("span")
const getByID = id => document.getElementById(id)

var trollText = []

 function initUI(){
    let uiComps = {}
    buttons.forEach((b)=>{uiComps[b.id]= document.getElementById(b.id)})
    counts.forEach((b)=>{uiComps[b.id]= document.getElementById(b.id)})
    ui={
        ...uiComps,
    scoreDisplay : getByID('scoreDisplay'),
    scoreRate: getByID('scoreRate'),
    }
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
   updateUI()
}else{
    return
}
}

function updateUI(){
    initUI()
    ui.schedulerButton.innerText = `Buy Post Scheduler (${methodCosts.postScheduler()} Engagement)`
    ui.schedulerCount.innerText = `Post Schedulers: ${methods.postScheduler}`
    ui.twitterBotButton.innerText = `Buy Twitter Bot (${methodCosts.twitterBot()} Engagement)`
    ui.twitterBotCount.innerText = `Twitter Bots: ${methods.twitterBot}`
    ui.targetedAdsButton.innerText = `Buy Targeted Ads (${methodCosts.targetedAds()} Engagement)`
    ui.targetedAdsCount.innerText = `Targeted Ads: ${methods.targetedAds}`
    ui.scoreDisplay.innerText = `Engagement: ${score}`
    ui.scoreRate.innerText= `Engagement per second: ${Math.floor(scorePerSecond().toFixed(1))}`
}


function increment(num){
    score = score + num
    ui.scoreDisplay.innerText = `Engagement: ${score}`
}

function scrollTerminal(){
    const terminalLines = document.querySelectorAll("p")
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
    updateUI()   
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
