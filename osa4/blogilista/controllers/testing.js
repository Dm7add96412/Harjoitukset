const testRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testRouter.post('/reset', async (request, response) => {
  console.log('Resetting test database...')
 // const usersBefore = await User.find({})
 // console.log(usersBefore)
  await Blog.deleteMany({})
  await User.deleteMany({})
  console.log('Test database has been reset...')
 // const usersAfter = await User.find({})
 // console.log(usersAfter)

  response.status(204).end()
})

module.exports = testRouter