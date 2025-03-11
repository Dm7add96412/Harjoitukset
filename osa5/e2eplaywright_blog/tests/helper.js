const loginWith = async (page, username, password) => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const addBlog = async (page, title, author, url) => {
  if (await page.getByRole('button', { name: 'Add a new blog' }).isVisible()) {
    await page.getByRole('button', { name: 'Add a new blog' }).click()
  }
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'Save' }).click()
  await page.getByText(`A new blog "${title}" by ${author} has been added`).waitFor()
}

const likeBlog = async (blog, times) => {
  const likeButton = blog.locator('.hiddenContent').getByRole('button', { name: 'like' })
  for (let i = 0; i < times; i++) {
    await likeButton.click()
  }
}

export { loginWith, addBlog, likeBlog }