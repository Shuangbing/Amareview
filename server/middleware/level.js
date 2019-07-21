module.exports = options => {
    const assert = require('http-assert')
    return async (req, res, next) => {
      assert(req.user.level >= 10, 401, '権限がありません')
      await next()
    }
  }