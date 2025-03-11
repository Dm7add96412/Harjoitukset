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
            data-testid='title'
            type="text"
            value={title}
            onChange={event => setTitle(event.target.value)}
            id='title'
          />
        </div>
        <div>
          Author:
          <input
            data-testid='author'
            type="text"
            value={author}
            onChange={event => setAuthor(event.target.value)}
            id='author'
          />
        </div>
        <div>
          Url:
          <input
            data-testid='url'
            type="text"
            value={url}
            onChange={event => setUrl(event.target.value)}
            id='url'
          />
        </div>
        <br />
        <button type='submit'>Save</button>
      </form>
    </div>
  )
}

export default BlogForm