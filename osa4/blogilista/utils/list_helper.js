const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  return likes.reduce(
    (acc, curr) => acc + curr, 0
  )
}

const favoriteBlog = (blogs) => {
  const highest = Math.max(...blogs.map(blog => blog.likes))
  const favorite = blogs.find(blog => blog.likes === highest)
  const favoritetyped = {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
  return favoritetyped
}

const mostBlogs = (blogs) => {
  const authors = blogs.map(blog => blog.author)
  let counts = {}
  let most = 0
  let mauthor = ""

  for (const author of authors) {
    counts[author] = counts[author] ? counts[author] + 1 : 1
  }

  for (const author of Object.keys(counts)) {
    if (counts[author] > most) {
      mauthor = author
      most = counts[author]
    } else {
      mauthor = mauthor
      most = most
    }
  }

  return {"author": mauthor, "blogs": most}
}

const mostLiked = (blogs) => {
  let most = 0
  let likedauthor = ""
  let counts = {}
  for (const blog of blogs) {
    counts[blog.author] = counts[blog.author] ? counts[blog.author] += blog.likes : blog.likes 
  }
  for (const author of Object.keys(counts)) {
    if (counts[author] > most) {
      most = counts[author]
      likedauthor = author
    } else {
      most = most
      likedauthor = likedauthor
    }
  }

  return {"author": likedauthor, "likes": most}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLiked
}