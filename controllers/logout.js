const router = require('express').Router()
const ActiveSessions = require('../models/active_sessions')

router.delete('/:id', async (req, res) => {
  await ActiveSessions.destroy({
    where: {
      userId: req.params.id
    }
  })
  res.sendStatus(200)
})

module.exports = router