const Blogpost = require('../models/blogpost')
const Fun = require('../models/fun')
const mongoose= require('mongoose');
function createNewDate(){
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
return(today)
}

async function createPosts() {
    await Blogpost.create({title: "First post", date: createNewDate(), body: "helllo helloo testing"  })
    await Fun.create({title: "Weather finder", link:"weather",description: "Enter location in the search bar to find the weather."})
    console.log("added post")
}


mongoose.connect('mongodb://localhost:27017/EsBlog')
const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', ()=>{
    console.log("database connected")
});

createPosts()