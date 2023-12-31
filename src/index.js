const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const path = require('path')
const bcrypt = require('bcrypt')
const collection = require('./config')
const userFeedback = require('./userFeedback')
const admin = require('./admin')
const subPdf = require('./subPdf')
const { ObjectId } = require('mongodb')
const { error } = require('console')
//npx nodemon src/index.js
const app = express()

app.use(express.json())

app.use(express.urlencoded({extended: false}))

app.set('view engine','ejs')

app.use(express.static("public"))

mongoose.set('strictQuery',false)
app.get("/", (req,res)=>{
    res.render("login")
})

app.get("/signup", (req,res)=>{
    res.render("signup")
})

app.post("/subject", async(req,res)=>{
    const selectData = {
        branch:req.body.branch,
        semester:req.body.semester
    }
    const subData = await subPdf.find()
    res.render("subject",{selectData:selectData,subData:subData})
})

app.get("/pdf",async (req,res)=>{
    const selectData = {
        param1:req.query.param1,
        param2:req.query.param2,
        param3:req.query.param3
    }
    const subData = await subPdf.findOne({detail:req.query.param1})
    res.render("pdf",{selectData:selectData,subData:subData})
})

app.get("/subject", async (req,res)=>{
    const selectData = {
        branch:req.query.param1,
        semester:req.query.param2
    }
    // console.log(req.query.param1,req.query.param2)
    const subData = await subPdf.find()
    res.render("subject",{selectData:selectData,subData:subData})
})


app.get("/semester", async (req,res)=>{
    const selectData = {
        branch:req.query.param1
    }
    // console.log(req.query.param1,req.query.param2)
    const subData = await subPdf.findOne({detail:req.query.param1})
    res.render("semester",{selectData:selectData,subData:subData})
})
app.post("/feedback", async (req,res)=>{
    const Data = {
        Mail:req.body.mail,
        Mobile:req.body.mobile,
        Text:req.body.text
    }
    try{
        const data = await userFeedback.insertMany(Data)
    }
    catch{
        console.log(error)
    }
    res.send("Thanks for giving Feedback")
})

app.post("/signup", async (req,res)=>{
    const data = {
        name:req.body.username,
        password:req.body.password,
        open:1
    }

    const existUser = await collection.findOne({name: data.name})

    if(existUser){
        res.send("username alreaay exist")
    }
    else{
        const saltRounds = 10
        const hashPassword = await bcrypt.hash(data.password,saltRounds)
        data.password = hashPassword

        const userdata = await collection.insertMany(data)
        const displayData = await subPdf.find()
        // console.log(userdata)
        const adminInfo = await admin.findOne({name:data.name})
        res.render('home',{user:data , display:displayData ,adminInfo:adminInfo})
    }
    
})
let info
app.post("/login", async (req,res)=>{
    try{
        const check = await collection.findOne({name:req.body.username})
        if(!check){
            res.send('user not exist')
        }
        else{
        const isPassword = await bcrypt.compare(req.body.password, check.password)
        if(!isPassword){
            res.send('wrong password')
        }
        else{

            const increment = {
                open:check.open+1
            }
            await collection.updateOne({_id: new ObjectId(check.id)},{$set:increment})
            const displayData = await subPdf.find()
            const adminInfo = await admin.findOne({name:check.name})
            info = adminInfo
            res.render('home',{user:check , display:displayData , adminInfo:adminInfo})
        }
    }
    }
    catch{
        res.redirect('/')
    }
})

const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log(`running on port ${port}`)
})


// -------------------admin panel--------------------
app.get("/adminLogin", async (req,res)=>{
    if(info != null){
        res.render("adminHome",{user:info})
    }
    else{
        res.render("login")
    }
})
// app.post("/adminCheck",(req,)=>{

// })
app.get("/editBranch", async (req,res)=>{
    const displayData = await subPdf.find()
    if(info != null){
        res.render("editBranch",{displayData:displayData})
    }
    else{
        res.render("login")
    }

})
app.get("/editSubject", async (req,res)=>{
    const displayData = await subPdf.find()
    if(info != null){
        res.render("editSubject",{display:displayData})
    }
    else{
        res.render("login")
    }

})
app.get("/editPdf", async (req,res)=>{
    const displayData = await subPdf.find()
    if(info != null){
        res.render("editPdf",{display:displayData})
    }
    else{
        res.render("login")
    }

})

// -----------------Branch -----------------

app.post("/addBranch",async (req,res)=>{
    const findLen = await subPdf.find()
    const data={
        branch:req.body.subName,
        link:req.body.link,
        detail: (findLen.length + 1),
        sem1: [],
        sem2: [],
        sem3: [],
        sem4: [],
        sem5: [],
        sem6: [],
        sem7: [],
        sem8: []
        
    }
    const data2 ={
        branchName:req.body.subName,
        branchLink:req.body.link
    }
    const adm = await admin.updateOne({_id: new ObjectId(info.id)},{$push:{branchAdd:data2}})
    const Added= await subPdf.insertMany(data)
    res.send(Added)
})

app.post("/deleteBranch",async (req,res)=>{
    const data2 ={
        branchName:req.body.subName
    }
    const Delete= await subPdf.findOne({branch:req.body.subName})
       const done= await subPdf.deleteOne(Delete)
       const adm = await admin.updateOne({_id: new ObjectId(info.id)},{$push:{branchDel:data2}})
    // console.log(Delete)
    res.send(done)
})

// ------------Subject-------------

app.post("/addSubject",async (req,res)=>{
    const data={
        subject:req.body.subjectName,
        subjectLink:req.body.link,
        pdfLinks:[]
    }
    const data2 ={
            branchName:req.body.branch,
            semesterName:req.body.semester,
            subjectName:req.body.subjectName,
            subjectLink:req.body.link
    }
    const semester = String(req.body.semester)
    const subData = await subPdf.findOne({detail:req.body.branch})
    const done= await subPdf.updateOne({_id: new ObjectId(subData.id)},{ $push: { [semester]: data }})
    const adm = await admin.updateOne({_id: new ObjectId(info.id)},{$push:{subjectAdd:data2}})
    res.send(done)
})
app.post("/deleteSubject",async (req,res)=>{
    const data2 ={
        branchName:req.body.branch,
        semesterName:req.body.semester,
        subjectName:req.body.subjectName
}
    const data=req.body.subjectName
    const semester = String(req.body.semester)
    const subData = await subPdf.findOne({detail:req.body.branch})
    const done= await subPdf.updateOne({_id: new ObjectId(subData.id)},{ $pull: { [semester]: { subject: data } }})
    const adm = await admin.updateOne({_id: new ObjectId(info.id)},{$push:{subjectDel:data2}})
    // console.log(done)
    res.send(done)
})

// ----------------pdf---------------

app.post("/addPdf",async (req,res)=>{
    const data={
        url:req.body.link,
        title:req.body.pdfName
    }
    const data2 ={
        branchName:req.body.branch,
        semesterName:req.body.semester,
        subjectName:req.body.subjectName,
        pdfName:req.body.pdfName,
        pdfLink:req.body.link
}
    const str = req.body.semester+".subject"
    const str2= req.body.semester+".$.pdfLinks"
    const done= await subPdf.updateOne( { "detail": req.body.branch, [str]: req.body.subjectName },
    { $push: { [str2]: data } })
    const adm = await admin.updateOne({_id: new ObjectId(info.id)},{$push:{pdfAdd:data2}})
    // console.log(done)
    res.send(done)
})

app.post("/deletePdf",async (req,res)=>{
    const data2 ={
        branchName:req.body.branch,
        semesterName:req.body.semester,
        subjectName:req.body.subjectName,
        pdfName:req.body.pdfName
}
    const str = req.body.semester+".subject"
    const str2= req.body.semester+".$.pdfLinks"
    const done= await subPdf.updateOne( { "detail": req.body.branch, [str]: req.body.subjectName },
    { $pull: { [str2]: {title: req.body.pdfName} } })
    const adm = await admin.updateOne({_id: new ObjectId(info.id)},{$push:{pdfDel:data2}})
    // console.log(done)
    res.send(done)
})