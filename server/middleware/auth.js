module.exports = options => {
    const assert = require('http-assert')
    const jwt = require('jsonwebtoken')
    const User = require('../models/User')
  
    return async (req, res, next) => {
      const token = String(req.headers.authorization || '').split(' ').pop()
      assert(token, 401, 'ログインしてください')
      const { id } = jwt.verify(token, req.app.get('secret'))
      assert(id, 401, 'ログインしてください')
      req.user = await User.findById(id)
      assert(req.user, 401, 'ログインしてください')
      await next()
    }
  }