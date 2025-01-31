import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewNote] = useState('')
 // const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input 
        type="text"
        value={username}
        name="Username"
        onChange={({target}) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input 
        type="password"
        value={password}
        name="Password"
        onChange={({target}) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const loggedIn = () =>  (
      <div>
        <p>{user.name} logged in</p>
          {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    )


  return (
    <div>
      {user ? <h1>Blogs</h1> : <h1>Log in to application</h1>}
      <Notification message={errorMessage}/>
      {user ? loggedIn() : loginForm()}

    </div>
  )
}

export default App