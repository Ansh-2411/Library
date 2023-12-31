const mongoose = require('mongoose')
require('dotenv').config()
const connect = mongoose.connect(process.env.MONGO_URI)
// const connect = mongoose.connect('mongodb+srv://pdpuelibrary:Library123@cluster0.kblp8yd.mongodb.net/Library')
// const connect = mongoose.connect('mongodb://localhost:27017/Library')

mongoose.set('strictQuery',false)

connect.then(()=>{
    console.log('database connected')
})
.catch(()=>{
    console.log("database connection failed")
})


const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    open:{
        type: Number
    }
})

const collection = new mongoose.model("users",LoginSchema)

module.exports = collection