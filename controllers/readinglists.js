const router = require('express').Router()
const { tokenExtractor, activeUser } = require('../util/middleware')

const { UserBlogs, User } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const blog = await UserBlogs.create({
      userId: req.body.user_id,
      blogId: req.body.blog_id
    })
    res.json(blog)
  } catch(error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, activeUser, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  
  if (!user.disabled) {
    try {
      const blog = await UserBlogs.findOne({
        where: {
          userId: user.dataValues.id,
          blogId: req.params.id
        }
      })
  
      blog.read = req.body.read
      await blog.save()
      res.json(blog)
    } catch(error) {
      next(error)
    }
  }

  next()
})

module.exports = router