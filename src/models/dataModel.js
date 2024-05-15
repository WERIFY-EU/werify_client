const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    data: mongoose.Schema.Types.Mixed
});


const userSchema = new mongoose.Schema({
    user: mongoose.Schema.Types.Mixed
});

const aoc_userSchema = new mongoose.Schema({
    aoc_user: mongoose.Schema.Types.Mixed
});

const i2cat_userSchema = new mongoose.Schema({
    i2cat_user: mongoose.Schema.Types.Mixed
});


const Data = mongoose.model('Data', dataSchema);
const User = mongoose.model('User', userSchema);
const AocUser = mongoose.model('AocUser', aoc_userSchema);
const I2CATUser = mongoose.model('I2catUser', i2cat_userSchema);

module.exports = { Data, User, AocUser, I2CATUser };