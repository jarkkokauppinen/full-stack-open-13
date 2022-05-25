const router = require('express').Router()
const { tokenExtractor, activeUser } = require('../util/middleware')
const { User, Blog } = require('../models')

router.get('/', async (_req, res) => {
  const users = await User.findAll({
    include: { model: Blog }
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read) {
    where.read = req.query.read
  }

  const user = await User.findByPk(req.params.id, {
    include: {
      model: Blog,
      as: 'readings',
      through: {
        attributes: ['read', 'id'],
        where
      }
    },
    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
  })
  res.send(user)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.put('/:username', tokenExtractor, activeUser, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user && !user.disabled) {
    user.name = req.body.name
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router