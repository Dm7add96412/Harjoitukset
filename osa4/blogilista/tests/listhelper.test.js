const listHelper = require('../utils/list_helper')
const helper = require('../tests/test_helper')

test('dummy returns one', () => {
    const result = listHelper.dummy(helper.emptyList)
    expect(result).toBe(1)
    })

describe('total likes', () => {
    test('when list has only one blog equals the likes of that', () => {
      const result = listHelper.totalLikes(helper.listWithOneBlog)
      expect(result).toBe(5)
    })

    test('of empty list is zero', () => {
      const result = listHelper.totalLikes(helper.emptyList)
      expect(result).toBe(0)
    })

    test('of a bigger list is calculated right', () => {
      const result = listHelper.totalLikes(helper.initialBlogs)
      expect(result).toBe(36)
    })
  })

describe('favorites', () => {
  test('finds the most liked blog', () => {
    const mostliked = {
      title: helper.initialBlogs[2].title,
      author: helper.initialBlogs[2].author,
      likes: helper.initialBlogs[2].likes
    }

    const result = listHelper.favoriteBlog(helper.initialBlogs)
    expect(result).toEqual(mostliked)
  })
})

describe('most blogs', () => {
  test('finds the author with most blogs', () => {
    const mostBlogsauthor = {
      author: "Robert C. Martin",
      blogs: 3
    }

    const result = listHelper.mostBlogs(helper.initialBlogs)
    expect(result).toEqual(mostBlogsauthor)
  })
})

describe('most liked', () => {
  test('finds the author with most likes', () => {
    const mostLikes = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    
    const result = listHelper.mostLiked(helper.initialBlogs)
    expect(result).toEqual(mostLikes)
  })
})