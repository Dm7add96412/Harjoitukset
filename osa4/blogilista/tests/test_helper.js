const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]

  const emptyList = []

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const newBlog = {
    title: 'this is a new blog',
    author: 'Villi Wäinö',
    url: 'www.newblog.com'
  }

  const noTitle = {
    author: 'Villi Wäinö',
    url: 'www.newblog.com'
  }

  const noUrl = {
    title: 'this is a new blog',
    author: 'Villi Wäinö'
  }

  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

  const initialUsers = [
    {
      "username": "Juha",
      "name": "Chucachuca",
      "password": "123123"
  },
  {
    "username": "Jaajoooo",
    "name": "ChaChaCha",
    "password": "321321"
  },
  {
    "username": "Jaajaa",
    "name": "Jeejeejee",
    "password": "3453453"
  }
  ]

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
  }

  const validUser = {
    username: 'Testiuserjuu',
    password: 'hyvapassu432'
  }
  
  const tooShortUsername = {
    username: 'Ja',
    password: '543543'
  }

  const tooShortPassword = {
    username: 'Jaajaa',
    password: '54'
  }

  const noUsername = {
    password: '543543'
  }

  const noPassword = {
    username: 'Jaajaa',
  }

  module.exports = {
    initialBlogs,
    emptyList,
    listWithOneBlog,
    newBlog,
    noTitle,
    noUrl,
    blogsInDb,
    initialUsers,
    validUser,
    tooShortUsername,
    tooShortPassword,
    noUsername,
    noPassword,
    usersInDb
  }