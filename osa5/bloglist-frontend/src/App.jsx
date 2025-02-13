import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [newError, setNewError] = useState(false)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNewError(true)
      setMessage('Wrong credentials')
      setTimeout(() => {
        setMessage(null)
        setNewError(false)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username: 
        <input 
        type="text"
        value={username}
        name="Username"
        onChange={({target}) => setUsername(target.value)}
        />
      </div>
      <div>
        password: 
        <input 
        type="password"
        value={password}
        name="Password"
        onChange={({target}) => setPassword(target.value)}
        />
      </div>
      <br></br>
      <button type='submit'>login</button>
    </form>
  )

  const logOut = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const addBlog = (blogObject) => {
      blogService
        .create(blogObject)
          .then(returnedBlog => {
            setBlogs(blogs.concat(returnedBlog))
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

  const loggedIn = () =>  (
      <div>
        <p>{user.name} logged in <button onClick={logOut}>Logout</button></p>
        <Togglable buttonLabel="Add a new blog">
          <BlogForm createBlog={addBlog}/>
        </Togglable>
          {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
        ))}
      </div>
  )

  return (
    <div>
      {user ? <h1>Blogs</h1> : <h1>Log in to application</h1>}
      <Notification message={message} error={newError}/>
      {user ? loggedIn() : loginForm()}

    </div>
  )
}

export default App