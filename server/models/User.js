const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: { type: String, unique: true, required: true},
    password: {
        type: String,
        select: false,
        required: true,
        set(val) {
            return require('bcrypt').hashSync(val, 10)
        }
    },
}, {
        timestamps: true
    })

module.exports = mongoose.model('User', schema)