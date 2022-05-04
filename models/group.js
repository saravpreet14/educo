const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    name: {type: String, default: ''},
    groupType: {type: String, default: ''},
    image: {type: String, default: 'default.png'},
    students: [{
        username: {type: String, default: ''},
        email: {type: String, default: ''}
    }],
    createdBy: String
});

module.exports = mongoose.model('Group', groupSchema);