const mongoose = require('mongoose');
const {v4: uuidv4} = require('uuid');

const userSchema = new mongoose.Schema({
    _id : { type: String, default: uuidv4 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {type: String, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, default: false},
    favorites: {
        type: [String],
        default: []
    },
    createAt: { type: Date, default: Date.now },
});


const User = mongoose.model('User', userSchema);

module.exports = User;