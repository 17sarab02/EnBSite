const mongoose = require('mongoose')

messageConnection = mongoose.createConnection('mongodb://localhost:27017/enb')

messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    email_validity: {
        type: Boolean,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

module.exports.messageModel = messageConnection.model('messages', messageSchema)