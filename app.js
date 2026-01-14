const express = require('express');
const path = require('path');
const mongoose= require('mongoose');
const ejsMate = require('ejs-mate')
const Blogpost = require('./models/blogpost')
const methodOverride = require('method-override');
const Fun = require('./models/fun');
const app = express()

require('dotenv').config() 
console.log(process.env.WEATHER_API)

app.engine('ejs', ejsMate);
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:true}))
app.set('views',path.join(__dirname, 'views'))
app.use(methodOverride('_method'))

mongoose.connect('mongodb://localhost:27017/EsBlog')
const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', ()=>{
    console.log("database connected")
});

app.get("/", (req, res) =>{
    res.render("home")
})
app.get('/blogpost', async (req, res) =>{
    const blogposts = await Blogpost.find({})
    res.render("blogposts/index", {blogposts})
})
app.get("/blogpost/create", (req, res) =>{
    res.render('admin/create')
})
app.get('/blogpost/:id',  async (req, res) =>{
    const {id} = req.params
    const blogpost = await Blogpost.findById(id)
    console.log(blogpost)
    res.render("blogposts/show", {blogpost})
})
app.get('/fun', async(req, res) =>{
    const funs = await Fun.find({})
    res.render("fun/index", {funs})
})
app.get('/fun/:id', async(req, res) =>{
    const {id} = req.params
    const fun = await Fun.findById(id)
    res.render(`../pages/${fun.link}`)
})
app.post("/blogpost", async(req,res) =>{
    const newPost = new Blogpost(req.body.blogpost)
    newPost.date = new Date().toLocaleDateString('en-US')
    await newPost.save()
    res.redirect('/blogpost')
})
app.delete("/blogpost/:id", async(req, res) =>{
    const {id} = req.params
    const deletedPost = await Blogpost.findByIdAndDelete(id)
    res.redirect('/blogpost')
})
app.listen('3000', () =>{
    console.log("server listening on port 3000")
})