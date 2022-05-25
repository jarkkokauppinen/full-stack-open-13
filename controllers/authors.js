const router = require('express').Router()

const { Sequelize } = require('sequelize')
const { Blog } = require('../models')

router.get('/', async (_req, res) => {
  try {
    const all = await Blog.findAll({
      attributes: [
        'author',
        [Sequelize.fn('COUNT', Sequelize.col('author')), 'blogs'],
        [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes'],
      ],
      group: 'author'
    })
    res.send(all)
  } catch(error) {
    res.send(error)
  }
})

module.exports = router
