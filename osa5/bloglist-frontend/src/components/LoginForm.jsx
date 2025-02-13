import { useState } from "react"

const LoginForm = ({loginUser}) => {

    const [username, setUsername] = useState('') 
    const [password, setPassword] = useState('')

    const handleLogin = (event) => {
        event.preventDefault()
        loginUser({
            username: username,
            password: password
        })
        setUsername('')
        setPassword('')
    }

    return (
        <form onSubmit={handleLogin}>
        <div>
          username: 
          <input 
          type="text"
          value={username}
          name="Username"
          onChange={event => setUsername(event.target.value)}
          />
        </div>
        <div>
          password: 
          <input 
          type="password"
          value={password}
          name="Password"
          onChange={event => setPassword(event.target.value)}
          />
        </div>
        <br></br>
        <button type='submit'>Login</button>
      </form>
    )
}

export default LoginForm