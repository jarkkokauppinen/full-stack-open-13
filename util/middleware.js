const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')

const ActiveSessions = require('../models/active_sessions')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const activeUser = async (req, res, next) => {
  const active = await ActiveSessions.findOne({
    where: {
      userId: req.decodedToken.id,
      token: req.get('authorization').substring(7)
    }
  })

  if (!active) {
    return res.status(401).json({ error: 'token invalid' })
  }
  
  next()
}

module.exports = { tokenExtractor, activeUser }