import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('createBlog with right data', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    const container = render(<BlogForm createBlog={createBlog} />)
      .container

    const title = container.querySelector('#title')
    const author = container.querySelector('#author')
    const url = container.querySelector('#url')
    const saveButton = screen.getByText('Save')

    await user.type(title, 'Artturin testiajot osa 1')
    await user.type(author, 'Artturi Author')
    await user.type(url, 'www.artturiauthor.com')
    await user.click(saveButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].author).toBe('Artturi Author')
    expect(createBlog.mock.calls[0][0].title).toBe('Artturin testiajot osa 1')
    expect(createBlog.mock.calls[0][0].url).toBe('www.artturiauthor.com')
  })
})