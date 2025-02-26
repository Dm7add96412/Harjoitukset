import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    author: 'T. Testaajan veli',
    title: 'Renderöityykö tämä minnekkään?',
    url: 'www.render.fi',
    user: {
      username: 'User Name'
    }
  }
  const user = {
    username: 'User Name'
  }
  let container
  let mockHandler

  beforeEach(() => {
    mockHandler = vi.fn()
    container = render(
      <Blog blog={blog} user={user} updateLikes={mockHandler}/>
    ).container
  })

  test('renders content', () => {
    screen.getByText('Renderöityykö tämä minnekkään?')
  })

  test('does not render hidden content', () => {
    const div = container.querySelector('.hiddenContent')
    expect(div).toHaveStyle('display: none')
  })

  test('clicking button shows hidden content', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.hiddenContent')
    expect(div).toBeVisible()

    screen.getByText('T. Testaajan veli')
    screen.getByText('www.render.fi')
    screen.getByText('User Name')
    screen.getByText('likes')
  })

  test('clicking like button', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const buttonLike = screen.getByText('like')
    await user.click(buttonLike)
    await user.click(buttonLike)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

})