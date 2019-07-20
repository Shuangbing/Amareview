module.exports = app => {
    const express = require('express')
    const assert = require('http-assert')
    const jwt = require('jsonwebtoken')
    const User = require('../models/User')
    const Order = require('../models/Order')
    const Payment = require('../models/Payment')
    const router = express.Router({
        mergeParams: true
    })

    router.get('/order', async (req, res) => {
        const order = await Order.find({user: req.user.id}).sort('-createdAt')
        res.send({
            message: '注文リストを確認できました',
            data: order
        })
    })

    router.get('/order/:id', async (req, res) => {
        const order = await Order.findById(req.params.id)
        res.send({
            message: '注文リストを確認できました',
            data: order
        })
    })

    router.delete('/order/:id', async (req, res) => {
        const order = await Order.findByIdAndRemove(req.params.id)
        res.send({
            message: '注文を削除しました',
        })
    })


    router.post('/order', async (req, res) => {
        const { title, asin, price_order, price_refund, seller, status, comment, order_id } = req.body
        const order = await Order.create({
            user: req.user.id,
            title: title,
            asin: asin,
            price_order: price_order,
            price_refund: price_refund,
            seller: seller,
            status: status,
            comment: comment,
            order_id: order_id
        })
        res.send({
            message: '注文を作成しました',
            data: order
        })
    })

    router.put('/order/:id', async (req, res) => {
        const order = await Order.findOneAndUpdate({_id: req.params.id, user: req.user.id}, req.body, { new: true })
        res.send({
            message: '注文を更新しました',
            data: order
        })
    })

    router.put('/order/status', async (req, res) => {
        const { id, status } = req.body;
        const order = await Order.findOneAndUpdate({_id: id, user: req.user.id}, {
            status: status
        }, { new: true })
        res.send({
            message: '注文を更新しました',
            data: order
        })
    })

    router.get('/payment', async (req, res) => {
        const payment = await Payment.find({user: req.user.id})
        res.send({
            message: '購入方法確認できました`',
            data: payment
        })
    })

    router.post('/payment', async (req, res) => {
        const { type, account, password, comment } = req.body
        const payment = await Payment.create({
            user: req.user.id,
            type: type,
            account: account,
            password: password,
            comment: comment
        })
        res.send({
            message: '購入方法を作成しました',
            data: payment
        })
    })

    router.put('/payment', async (req, res) => {
        const { id, type, account, password, comment } = req.body
        const payment = await Payment.findOneAndUpdate({_id: id, user: req.user.id}, {
            type: type,
            account: account,
            password: password,
            comment: comment
        }, { new: true })
        res.send({
            message: '購入方法を更新しました',
            data: payment
        })
    })

    const authMiddleware = require('../middleware/auth')
    app.use('/api', authMiddleware(), router)

    app.post('/auth/register', async (req, res) => {
        const { username, password } = req.body
        const user = await User.create({
            username: username,
            password: password
        })
        
        res.send({
            message: '登録完了',
            data: user
        })
    })

    app.post('/auth', async (req, res) => {
        const { username, password } = req.body
        const user = await User.findOne({
            username: username
        }).select('+password')
        assert(user, 401, 'ユーザが見つかりませんでした')
        const isValid = require('bcrypt').compareSync(password, user.password)
        assert(isValid, 422, 'パスワードが正しくありません')
        const token = jwt.sign({ id: user._id }, app.get('secret'))
        res.send({
            message: 'ログイン完了',
            data: {
                username: user.username,
                access_token: token
            }
        })
    })


    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}