const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    data: mongoose.Schema.Types.Mixed
});


const userSchema = new mongoose.Schema({
    user: mongoose.Schema.Types.Mixed
});


const Data = mongoose.model('Data', dataSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Data, User };