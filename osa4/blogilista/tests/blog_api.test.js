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
    await User.deleteMany({})
    await Blog.deleteMany({})

    const createUser = async (user) => {
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(user.password, saltRounds)
        return new User({...user, passwordHash}).save()
    }

    const users = await Promise.all(
      helper.initialUsers.map((user) => createUser(user))
    )
    
    const blogIds = []
    const user = users[0]
    for ( const blog of helper.initialBlogs) {
      const newBlog = new Blog({...blog, user: user._id})
      const savedBlog = await newBlog.save()
      blogIds.push(savedBlog._id)
    }
    user.blogs = user.blogs.concat(blogIds)
    await user.save()
  })

  test('blogs are returned as json', async () => {
    console.log('entered tests')
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
    const loginResponse = await api
      .post('/api/login')
      .send({
          "username": "Juha",
          "password": "123123"
      })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token
    const newBlog = helper.newBlog
  
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
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

  test('a new blog cannot be added without a token', async () => {
    const newBlog = helper.newBlog

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  
    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).not.toContain(
      'this is a new blog'
    )
  })

  test('if likes value is not set, it will be 0', async () => {
    const loginResponse = await api
    .post('/api/login')
    .send({
        "username": "Jaajoooo",
        "password": "321321"
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token
    const newBlog = helper.newBlog

    const posted = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const likes = posted.body.likes
    expect(likes).toBe(0)
  })

  test('if title value is not set, Blog validation failed: title: Path `title` is required', async () => {
    const loginResponse = await api
    .post('/api/login')
    .send({
        "username": "Jaajaa",
        "password": "3453453"
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token
    const newBlog = helper.noTitle

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('if url value is not set, Blog validation failed: url: Path `url` is required.', async () => {
    const loginResponse = await api
    .post('/api/login')
    .send({
        "username": "Jaajaa",
        "password": "3453453"
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token
    const newBlog = helper.noUrl

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('deletion of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    const blogInDb = await Blog.findById(blogToDelete.id).populate('user', { username: 1, name: 1, id: 1})
    const userInDb = await User.findById(blogInDb.user._id.toString())

    const initialUser = helper.initialUsers.find(user => user.username === userInDb.username)

    const loginResponse = await api
    .post('/api/login')
    .send({
        "username": initialUser.username,
        "password": initialUser.password
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const token = loginResponse.body.token

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
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

describe('User and password creation', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Promise.all(
    helper.initialUsers.map(async (user) => {
      await api.post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    }))
})

  test('all users are returned', async () => {
    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(helper.initialUsers.length)
  })

  test('creating a new user with valid data', async () => {
    const validUser = helper.validUser

    await api
      .post('/api/users')
      .send(validUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)
  
    const users = usersAtEnd.map(b => b.username)
    expect(users).toContain(
      'Testiuserjuu'
    )
  })

  test('400 error with too short username', async () => {
    const shortUsername = helper.tooShortUsername

    const check = await api
      .post('/api/users')
      .send(shortUsername)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    expect(check.body.error).toContain(
      'is shorter than the minimum allowed length (3).'
    )
  })

  test('400 error with too short password', async () => {
    const shortPassword = helper.tooShortPassword

    const check = await api
      .post('/api/users')
      .send(shortPassword)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    expect(check.body.error).toContain(
      'password minimum length 3 letters'
    )
  })

  test('400 error, username must be unique', async () => {
    const users = await helper.usersInDb()
    const username = users[0].username

    const newUser = {
      username: username,
      password: 'sagfas4543'
    }

    const check = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length)
    expect(check.body.error).toContain(
      'User validation failed: username: Error, expected `username` to be unique.'
    )
  })
})

afterAll(async () => {
    await mongoose.connection.close()
  })