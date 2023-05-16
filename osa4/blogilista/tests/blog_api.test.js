const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

describe('Blog/blogs tests', () => {
  beforeEach(async () => {
      await Blog.deleteMany({})
      await Blog.insertMany(helper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
      console.log('entered test')
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

  test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')

      expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('id in correct form', async () => {
      const response = await api.get('/api/blogs')
      let id = response.body.map(b => b.id)

      id.forEach(id => { 
          expect(id).toBeDefined()
      })
  })

  test('a new blog can be added', async () => {
      const newBlog = helper.newBlog
      console.log(newBlog)
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).toContain(
        'this is a new blog'
      )
    })

  test('if likes value is not set, it will be 0', async () => {
    const newBlog = helper.newBlog

    const posted = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    const likes = posted.body.likes
    expect(likes).toBe(0)
  })

  test('if title value is not set, return 400 bad request', async () => {
    const newBlog = helper.noTitle

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('if url value is not set, return 400 bad request', async () => {
    const newBlog = helper.noUrl

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('deletion of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      blogsAtStart.length - 1
    )

    const titles = blogsAtEnd.map(b => b.title)

    expect(titles).not.toContain(blogToDelete.title)
  })

  test('updating a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const update = {likes: blogToUpdate.likes + 2}

    const updated = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(update)
      .expect(200)

    const likesEnd = updated.body.likes
    expect(likesEnd).toBe(blogToUpdate.likes + 2)

    const blogsAtEnd = await helper.blogsInDb()
    const check = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    expect(check.likes).toBe(blogToUpdate.likes +2)
  })
})

describe('User and password checks', () => {
  test('creating a new user with valid data', async () => {

  })

  test('400 error with too short username', async () => {

  })

  test('400 error with too short password', async () => {

  })

  test('username must be unique', async () => {
    
  })
})

afterAll(async () => {
    await mongoose.connection.close()
  })