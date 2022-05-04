const mongoose = require('mongoose');

const classSchema = mongoose.Schema({
    topicName: String,
    teacherName: String,
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subjectName: String,
    startingTime: Date,
    expectedDuration: Number
});

module.exports = mongoose.model('Class', classSchema);