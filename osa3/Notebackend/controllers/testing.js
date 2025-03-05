const testingRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

testingRouter.get('/', (request, response) => {
  response.json({ message: 'is this working?' })
})

testingRouter.post('/reset', async (request, response) => {
  console.log('Resetting database...')
  const notesBefore = await Note.find({})
  console.log(notesBefore)
  await Note.deleteMany({})
  await User.deleteMany({})
  console.log('Database reset completed.')
  const notesAfter = await Note.find({})
  console.log(notesAfter)

  response.status(204).end()
})

module.exports = testingRouter