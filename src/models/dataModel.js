const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    data: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Data', dataSchema);