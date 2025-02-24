import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [author, setAuthor] = useState('')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      author: author,
      title: title,
      url: url
    })
    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <h2>Add a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
                Title:
          <input
            type="text"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>
        <div>
                Author:
          <input
            type="text"
            value={author}
            onChange={event => setAuthor(event.target.value)}
          />
        </div>
        <div>
                Url:
          <input
            type="text"
            value={url}
            onChange={event => setUrl(event.target.value)}
          />
        </div>
        <br />
        <button type='submit'>Save</button>
      </form>
    </div>
  )
}

export default BlogForm