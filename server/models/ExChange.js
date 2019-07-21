const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    rate: { type: Number, required: true},
    tag: { type: Number, default: 1 }
}, {
        timestamps: true
    })

module.exports = mongoose.model('ExChange', schema)