import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [newError, setNewError] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (loginUser) => {
    const username = loginUser.username
    const password = loginUser.password

    try {
      const user = await loginService.login({
        username: username, password: password
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
    } catch (exception) {
      setNewError(true)
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
        setNewError(false)
      }, 5000)
    }
  }

  const logOut = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat({ ...returnedBlog, user: { username: user.username, name: user.name, id: returnedBlog.user } }))
        setMessage(`A new blog "${blogObject.title}" by ${blogObject.author} has been added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        setNewError(true)
        setMessage(error.response.data.error)
        setTimeout(() => {
          setNewError(false)
          setMessage(null)
        }, 5000)
        if (error.response.data.error === 'token expired') {
          logOut()
        }
      })
  }

  const updateBlog = (id) => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, changedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : { ...returnedBlog, user: changedBlog.user }))
      })
      .catch(error => {
        setNewError(true)
        setMessage(error.response.data.error)
        setTimeout(() => {
          setNewError(false)
          setMessage(null)
        }, 5000)
      })
  }

  const deleteBlog = (id) => {
    const blog = blogs.find(b => b.id === id)

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id))
          setMessage(`Blog ${blog.title} removed successfully`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setNewError(true)
          setMessage(error.response.data.error)
          setTimeout(() => {
            setNewError(false)
            setMessage(null)
          }, 5000)
        })
    }
  }

  const loggedIn = () =>  (
    <div>
      <p>{user.name} logged in <button onClick={logOut}>Logout</button></p>
      <Togglable buttonLabel="Add a new blog">
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      <br/>
      <div className='blogs'>
        {blogs.map(blog => (
          <Blog key={blog.id} blog={blog} updateLikes={() => updateBlog(blog.id)} removeBlog={() => deleteBlog(blog.id)} user={user} />
        ))}
      </div>
    </div>
  )

  return (
    <div>
      {user && <h1>Blogs</h1>}
      <Notification message={message} error={newError}/>
      {user ? loggedIn() : <LoginForm loginUser={handleLogin}/>}

    </div>
  )
}

export default App