const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const FunSchema = new Schema({
    title: String, 
    description: String,
    link: String
    
})



module.exports = mongoose.model("Fun", FunSchema)