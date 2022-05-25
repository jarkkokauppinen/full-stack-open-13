const router = require('express').Router()
const { tokenExtractor, activeUser } = require('../util/middleware')
const { Op } = require('sequelize')

const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [{ title: req.query.search }, { author: req.query.search }]
    }
  }

  const blogs = await Blog.findAll({
    include: {
      model: User
    },
    order: [
      ['likes', 'DESC']
    ],
    where
  })

  res.json(blogs)
})

router.post('/', tokenExtractor, activeUser, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (!user.disabled) {
    try {
      const blog = await Blog.create({ ...req.body, userId: user.id })
      res.json(blog)
    } catch(error) {
      next(error)
    }
  }
})

router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', tokenExtractor, activeUser, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.disabled && blog.dataValues.userId === user.dataValues.id) {
    await blog.destroy()
  }
  res.status(204).end()
})

router.put('/:id', async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id)
    if (blog && req.body.likes) {
      try {
        blog.likes = req.body.likes
        await blog.save()
        res.json(blog)
      } catch(error) {
        next(error)
      }
    }

  next()
})

const errorHandler = (error, _req, res, next) => {
  if (error.name === 'SequelizeValidationError') {
    if (error.message.includes('isEmail')) {
      return res.status(400).send({ error: 'username should be a valid email address' })
    }
    return res.status(400).send({ error: error.message })
  }
  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).send({ error: error.message })
  }

  next(error)
}

module.exports = { router, errorHandler }