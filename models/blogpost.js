const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const BlogpostSchema = new Schema({
    title: String, 
    body: String,
    date: String
})



module.exports = mongoose.model("Blogpost", BlogpostSchema)

