const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, addBlog, likeBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Mikki Hiiri',
        username: 'mhiiri',
        password: 'salainen1234'
      }
    })

    await page.goto('/')
  })
  
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByText('Login')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mhiiri', 'salainen1234')

      await expect(page.getByText('Mikki Hiiri logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mhiiri', 'salaine1234')

      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Mikki Hiiri logged in')).not.toBeVisible()
    })
  })
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mhiiri', 'salainen1234')
      await page.getByText('Mikki Hiiri logged in').waitFor()
    })
  
    test('a new blog can be created', async ({ page }) => {
      await addBlog(page, 'Test Blog', 'Artturi Author', 'www.test.com')
      await expect(page.getByText('A new blog "Test Blog" by Artturi Author has been added')).toBeVisible()
      const blogsDiv = await page.locator('.blogs')
      await expect(blogsDiv).toContainText('Test Blog')
    })
    describe('When logged in and a test blog has been created', async() => {
      beforeEach(async ({ page }) => {
        await addBlog(page, 'Another test blog', 'Bill Blogger', 'www.billsblogs.com')
      })

      test('a blog can be liked', async ({ page }) => {
        const blogsDiv = await page.locator('.blogs')
        await expect(blogsDiv).toContainText('Another test blog')
        await blogsDiv.getByRole('button', { name: 'view' }).click()
        await expect(blogsDiv).toContainText('likes 0')
        await blogsDiv.getByRole('button', { name: 'like' }).click()
        await expect(blogsDiv).toContainText('likes 1')
      })
      test('A blog can be removed', async ({ page }) => {
        const blogsDiv = await page.locator('.blogs')
        await expect(blogsDiv).toContainText('Another test blog')
        await blogsDiv.getByRole('button', { name: 'view' }).click()
        await expect(blogsDiv.getByRole('button', { name: 'remove' })).toBeVisible()

        page.on('dialog', async dialog => {
          expect(dialog.type()).toBe('confirm')
          expect(dialog.message()).toEqual('Remove blog Another test blog by Bill Blogger?')
          await dialog.accept()
        })
        await blogsDiv.getByRole('button', { name: 'remove' }).click()
        await page.waitForTimeout(1000)
        await expect(page.getByText('Blog Another test blog removed successfully')).toBeVisible()
        await expect(blogsDiv.getByText('Another test blog')).not.toBeVisible()
      })
      test('Remove button only visible to user who added blog', async ({ page, request }) => {
        await request.post('/api/users', {
          data: {
            name: 'Minni Hiiri',
            username: 'minnihiiri',
            password: 'tosisalainen1234'
          }
        })
        const blogsDiv = await page.locator('.blogs')
        await expect(blogsDiv).toContainText('Another test blog')
        await blogsDiv.getByRole('button', { name: 'view' }).click()
        await expect(blogsDiv.getByRole('button', { name: 'remove' })).toBeVisible()
        await page.getByRole('button', { name: 'Logout' }).click()

        await loginWith(page, 'minnihiiri', 'tosisalainen1234')
        await page.getByText('Minni Hiiri logged in').waitFor()
        await expect(page.getByText('Minni Hiiri logged in')).toBeVisible()
        await expect(blogsDiv).toContainText('Another test blog')
        await blogsDiv.getByRole('button', { name: 'view' }).click()
        await expect(blogsDiv.getByRole('button', { name: 'remove' })).not.toBeVisible()
      })

      test('Blogs are sorted by likes', async ({ page }) => {
        await addBlog(page, 'test1', 'tester1', 'www.com')
        await addBlog(page, 'test2', 'tester2', 'www.com')
  
        const blogsDiv = await page.locator('.blogs')
        await expect(blogsDiv).toContainText('test1')
        const test0 = blogsDiv.getByText('Another test blog').locator('..')
        const test1 = blogsDiv.getByText('test1').locator('..')
        const test2 = blogsDiv.getByText('test2').locator('..')
        await test0.getByRole('button', { name: 'view' }).click()
        await test1.getByRole('button', { name: 'view' }).click()
        await test2.getByRole('button', { name: 'view' }).click()
        await likeBlog(test0, 1)
        await likeBlog(test1, 2)
        await likeBlog(test2, 4)
        await page.reload()
        await expect(page.locator('.blog').first()).toContainText('test2')
        await expect(page.locator('.blog').last()).toContainText('Another test blog')
      })
    })

  })
})