import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateLikes, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('view')

  const showWhenVisible = {
    display: visible ? '' : 'none',
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5 }

  const showRemove = {
    display: blog.user.username === user.username ? '' : 'none'
  }

  const toggleVisibility = () => {
    setVisible(!visible)
    if (buttonLabel === 'view') {
      setButtonLabel('hide')
    } else {
      setButtonLabel('view')
    }
  }

  return (
    <div>
      <div>
        {blog.title} / <b>{blog.author}</b> <button onClick={toggleVisibility}> {buttonLabel} </button>
      </div>
      <div style={showWhenVisible}>
        <div>
          <a href={blog.url} target="_blank" rel="noopener noreferrer">
            {blog.url}
          </a>
        </div>
        <div>
          likes {blog.likes} <button onClick={updateLikes}>like</button>
        </div>
        <div>
          {blog.user.username}
        </div>
        <div style={showRemove}>
          <button onClick={removeBlog}> remove </button>
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  updateLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired
    })
  }),
  user: PropTypes.shape({
    username: PropTypes.string.isRequired
  }).isRequired
}

export default Blog