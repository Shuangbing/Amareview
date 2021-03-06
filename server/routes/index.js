module.exports = app => {
    const express = require('express')
    const assert = require('http-assert')
    const jwt = require('jsonwebtoken')
    const User = require('../models/User')
    const Order = require('../models/Order')
    const Payment = require('../models/Payment')
    const ExChange = require('../models/ExChange')
    const router = express.Router({
        mergeParams: true
    })

    function setExChange(rate) {
        ExChange.findOne({ tag: 1 }, function (err, doc) {
            if (doc == null) {
                ExChange.create({ rate: rate })
            } else {
                doc.rate = rate
                doc.save()
            }
        })
    }


    router.get('/system/rate', async (req, res) => {
        const exchange = await ExChange.findOne() || { rate: 0 }
        res.send({ data: { rate: exchange.rate } })
    })

    router.post('/system/rate', async (req, res) => {
        const { rate } = req.body
        setExChange(rate)
        res.send({ message: 'レート更新完了' })
    })

    router.get('/dashboard', async (req, res) => {

        const exchange = await ExChange.findOne() || { rate: 0 }
        const PayingTotal = await Order
            .aggregate(
                [
                    {
                        $match: {
                            user: req.user._id, "status": { $gte: 6 }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            PayingRefundJPY: { $sum: "$price_order" },
                            PayingRefundCNY: { $sum: "$price_refund" },
                            Paying_SUM: { $sum: 1 },
                        }
                    }
                ])
        const OrderTotal = await Order
            .aggregate(
                [
                    {
                        $match: { user: req.user._id }
                    },
                    {
                        $group: {
                            _id: null,
                            orderSUM: { $sum: 1 },
                        }
                    }
                ])
        const OrderWaitRefundTotal = await Order
            .aggregate(
                [
                    {
                        $match: {
                            user: req.user._id, "status": {
                                "$gte": 1, "$lte": 5
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            orderRefundJPY: { $sum: "$price_order" },
                            orderRefundCNY: { $sum: "$price_refund" },
                            waitRefund_SUM: { $sum: 1 },
                        }
                    }
                ])
        const WeekTotal = await Order.aggregate([
            {
                $match: {
                    "user": req.user._id
                }
            },
            {
                $project: {
                    day: { $substr: [{ "$add": ["$createdAt", 32400000] }, 0, 10] },
                    "price_order": 1
                },
            },
            {
                $group: {
                    _id: "$day",
                    totalPrice: { $sum: "$price_order" },
                    totalCount: { $sum: 1 },
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])
        const { orderSUM } = OrderTotal.pop() || { orderSUM: 0 }
        const { orderRefundJPY, orderRefundCNY, waitRefund_SUM } = OrderWaitRefundTotal.pop() || { orderRefundJPY: 0, orderRefundCNY: 0, waitRefund_SUM: 0 }
        const { PayingRefundJPY, PayingRefundCNY, Paying_SUM } = PayingTotal.pop() || { PayingRefundJPY: 0, PayingRefundCNY: 0, Paying_SUM: 0 }
        res.send({
            data: {
                rate: exchange.rate,
                orderSUM: orderSUM,
                orderRefundCNY: orderRefundCNY,
                orderRefundJPY: orderRefundJPY,
                waitRefund_SUM: waitRefund_SUM,
                PayingRefundJPY: PayingRefundJPY,
                PayingRefundCNY: PayingRefundCNY,
                Paying_SUM: Paying_SUM,
                WeekTotal: WeekTotal,
            }
        })

    })

    router.get('/delivery', async (req, res) => {
        const orders = await Order.find({ user: req.user.id, status: 6 }).sort('-createdAt')
        await Order.updateMany({ user: req.user.id, status: 6 }, { $set: { status: 7 } })
        var csv_data = '#product_title,#product_price,#product_asin,#product_createAt\n'
        orders.forEach((data) => {
            csv_data += data.title + ',' + data.price_order + ',' + data.asin + ',' + data.createdAt + '\n'
        })
        res.status(200).send(csv_data);
    })

    router.get('/delivery/page/:page', async (req, res) => {
        const order_count = await Order.find({ user: req.user.id, status: { $gte: 6 } })
        const orders = await Order.find({ user: req.user.id, status: { $gte: 6 } }).skip((req.params.page - 1) * 10).limit(10).sort('-createdAt')
        res.send({
            total: order_count.length,
            data: orders
        })
    })

    router.get('/order/rate', async (req, res) => {
        const exchange = await ExChange.findOne()
        res.send({
            data: exchange || { rate: 1 }
        })
    })

    router.get('/order/page/:page', async (req, res) => {
        const order_count = await Order.find({ user: req.user.id, status: { $lte: 5 } })
        const orders = await Order.find({ user: req.user.id, status: { $lte: 5 } }).skip((req.params.page - 1) * 10).limit(10).sort('-createdAt')
        res.send({
            total: order_count.length,
            data: orders
        })
    })

    router.get('/order/:id', async (req, res) => {
        const order = await Order.findById(req.params.id)
        res.send({
            data: order
        })
    })

    router.delete('/order/:id', async (req, res) => {
        const order = await Order.findOneAndRemove({ _id: req.params.id, user: req.user.id })
        res.send({
            message: '注文を削除しました',
        })
    })


    router.post('/order', async (req, res) => {
        req.body.user = req.user.id
        const order = await Order.create(req.body)
        res.send({
            message: '注文を作成しました',
            data: order
        })
    })

    router.put('/order/:id', async (req, res) => {
        const order = await Order.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true })
        res.send({
            message: '注文を更新しました',
            data: order
        })
    })

    router.put('/order/status/:id', async (req, res) => {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, {
            status: status
        }, { new: true })
        res.send({
            data: order,
            message: '注文状態を更新しました'
        })
    })

    router.get('/payment/page/:page', async (req, res) => {
        const payment_count = await Payment.find({ user: req.user.id })
        const payment = await Payment.find({ user: req.user.id }).skip((req.params.page - 1) * 10).limit(10).sort('-createdAt')
        res.send({
            total: payment_count.length,
            data: payment
        })
    })

    router.get('/payment', async (req, res) => {
        const payment = await Payment.find({ user: req.user.id }).sort('-createdAt')
        res.send({
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

    router.put('/payment/:id', async (req, res) => {
        const { type, account, password, comment } = req.body
        const payment = await Payment.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, {
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

    router.get('/payment/:id', async (req, res) => {
        const payment = await Payment.findOne({ _id: req.params.id, user: req.user.id })
        res.send({
            data: payment
        })
    })

    router.delete('/payment/:id', async (req, res) => {
        const order = await Payment.findOneAndRemove({ _id: req.params.id, user: req.user.id })
        res.send({
            message: '購入方法を削除しました',
        })
    })

    const authMiddleware = require('../middleware/auth')
    const levelMiddleware = require('../middleware/level')

    router.get('/user/page/:page', async (req, res) => {
        const user_count = await User.find()
        const user = await User.find().skip((req.params.page - 1) * 10).limit(10).sort('-createdAt')
        res.send({
            total: user_count.length,
            data: user
        })
    })

    router.get('/user/:id', async (req, res) => {
        const user = await User.findById(req.params.id)
        res.send({
            data: user
        })
    })

    router.post('/user', levelMiddleware(), async (req, res) => {
        const user = await User.create(req.body)
        res.send({
            message: '従業員追加しました',
        })
    })

    router.put('/user/:id', levelMiddleware(), async (req, res) => {
        const user = await User.findByIdAndUpdate(req.params.id, req.body)
        res.send({
            message: '従業員情報更新しました',
        })
    })


    app.use('/api', authMiddleware(), router)

    app.get('/simple/post', async (req, res) => {
        const exchange = await ExChange.findOne()
        const { username, password, order_name, order_asin, order_price, order_no, order_account, seller } = req.query
        const user = await User.findOne({
            username: username
        }).select('+password')
        assert(user, 422, 'ユーザが見つかりませんでした')
        const isValid = require('bcrypt').compareSync(password, user.password)
        assert(isValid, 422, 'パスワードが正しくありません')
        const payment = await Payment.findOne({ user: user._id, account: order_account })
        const order = await Order.create({
            title: order_name,
            asin: order_asin,
            order_id: order_no,
            user: user._id,
            price_order: order_price,
            price_refund: parseInt(order_price * exchange.rate),
            payment: payment._id,
            seller: seller
        })
        res.send(order)

    })

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

    app.post('/auth/login', async (req, res) => {
        const { username, password } = req.body
        const user = await User.findOne({
            username: username
        }).select('+password')
        assert(user, 422, 'ユーザが見つかりませんでした')
        const isValid = require('bcrypt').compareSync(password, user.password)
        assert(isValid, 422, 'パスワードが正しくありません')
        const token = jwt.sign({ id: user._id }, app.get('secret'), { expiresIn: '1d' })
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