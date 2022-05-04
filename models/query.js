const mongoose = require('mongoose');

const querySchema = mongoose.Schema({
    keywords: String,
    processedKeywords: String,
    email: [String], // in case of multiple emails as in student
    phoneNos: [String],
    dateUploaded: Date,
    lastUpdated: {
        type: Date,
        default: 100000000
    },
    timesProcessed: { //tells how many times a query is proccessed
        type: Number,
        default: 0
    },
    pdfsProcessed: { 
        type: Number, 
        default: 0
    }, 
    clinicalResult: {
        type: String,
        default: ""
    },
    localResult: {
        type: String,
        default: ""
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model('Query', querySchema);