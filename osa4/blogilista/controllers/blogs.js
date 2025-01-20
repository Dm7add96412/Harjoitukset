const blogsRouter = require('express').Router()
const Blog =  require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1})
    response.json(blogs)
  })

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    console.log(request.token)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({error: 'token invalid'})
    }
    const user = await User.findById(decodedToken.id) 

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {

 const blog = await Blog.findById(request.params.id)
 if (!blog) {
  return response.status(401).json({error: 'such blog cannot be found to be removed'})
 }

 const decodedToken = jwt.verify(request.token, process.env.SECRET)
 if (!decodedToken.id) {
   return response.status(401).json({error: 'token invalid'})
 }

 if (!(blog.user.toString() === decodedToken.id)) {
  return response.status(400).json({error: 'tokens do not match'})
 } 
 await Blog.findByIdAndRemove(request.params.id)

  response.status(204).end()
})

blogsRouter.put('/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id

  const blog = {
    likes: body.likes
  }

  Blog.findByIdAndUpdate(id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter