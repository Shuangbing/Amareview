const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: { type: String, required: true },
    asin: { type: String },
    order_id: { type: String, required: true },
    user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User', required: true},
    payment: { type: mongoose.SchemaTypes.ObjectId, ref: 'Payment' },
    price_order: { type: Number },
    price_refund: { type: Number },
    seller: { type: String },
    status: { type: Number, default: 1 },
    comment: { type: String }
}, {
        timestamps: true
})

module.exports = mongoose.model('Order', schema)