module.exports = options => {
  const assert = require('http-assert')
  const jwt = require('jsonwebtoken')
  const User = require('../models/User')

  return async (req, res, next) => {
    const token = String(req.headers.authorization || '').split(' ').pop()
    assert(token, 422, 'ログインしてください')
    try {
      const { id } = jwt.verify(token, req.app.get('secret'))
      req.user = await User.findById(id)
      assert(req.user, 422, 'ログインしてください')
      await next()
    } catch (e) {
      assert(false, 422, '再ログインしてください')
    }
  }
}