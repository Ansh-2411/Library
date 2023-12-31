const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    url: { type: String},
    title: { type: String}
});

const semesterSchema = new mongoose.Schema({
    subject:String,
    subjectLink:String,
    pdfLinks: [subjectSchema]
});

const detailSchema = new mongoose.Schema({
    branch:String,
    link:String,
    detail: { type: Number },
    sem1: [semesterSchema],
    sem2: [semesterSchema],
    sem3: [semesterSchema],
    sem4: [semesterSchema],
    sem5: [semesterSchema],
    sem6: [semesterSchema],
    sem7: [semesterSchema],
    sem8: [semesterSchema]
});

const subPdf = mongoose.model('pdfs', detailSchema);

module.exports = subPdf;
