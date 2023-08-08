const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
    email: {type: String, require: true, unique: true},
    password: {type: String, required: true},

});

const UserModel = model('User', UserSchema);

module.exports = UserModel;