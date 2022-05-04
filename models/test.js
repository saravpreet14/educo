const mongoose = require('mongoose');

const testSchema = mongoose.Schema({
    name: String,
    subject: String,
    createdBy:String,
    startingTime: Date,
    endingTime: Date,
    content: [{
        question: String,
        options: [String],
        answer: Number
    }]
});

module.exports = mongoose.model('Test', testSchema);