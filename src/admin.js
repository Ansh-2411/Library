const mongoose = require('mongoose');

const admin = new mongoose.Schema({
    name: {
        type: String,
    },
    branchAdd:[
        {
            branchName:String,
            branchLink:String
        },
    ],
    branchDel:[
        {
            branchName:String
        },
    ],
    subjectAdd:[
        {   branchName:String,
            semesterName:String,
            subjectName:String,
            subjectLink:String
        },
    ],
    subjectDel:[
        {
            branchName:String,
            semesterName:String,
            subjectName:String
        },
    ],
    pdfAdd:[
        {
            branchName:String,
            semesterName:String,
            subjectName:String,
            pdfName:String,
            pdfLink:String
        },
    ],
    pdfDel:[
        {
            branchName:String,
            semesterName:String,
            subjectName:String,
            pdfName:String
        },
    ]
});

const adminLog = mongoose.model('admins', admin);

module.exports = adminLog;
