const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const ActiveSessions = require('../models/active_sessions')
const { User } = require('../models')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'salainen'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  console.log('token', token)
  console.log('user id', user.id)

  try {
    await ActiveSessions.create({
      userId: user.id,
      token: token
    })
    response
      .status(200)
      .send({ token, username: user.username, name: user.name })
  } catch(error) {
    response.send(error)
  }
})

module.exports = router