const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    type: { type: Number, required: true },
    account: { type: String, required: true },
    password: { type: String },
    comment: { type: String },
}, {
        timestamps: true
})

module.exports = mongoose.model('Payment', schema)