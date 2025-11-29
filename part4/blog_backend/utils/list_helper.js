const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {

    const likes = blogs.map(blog => blog.likes)
    const total = likes.reduce((sum, item) => sum + item, 0)
    return total
}

const favouriteBlog = (blogs) => {

    let maxLikes = 0
    let favBlog = null
    for(let blog of blogs){
        if(blog.likes > maxLikes){
            maxLikes = blog.likes
            favBlog = blog
        }
    }
    return favBlog
}
module.exports = {
    dummy, totalLikes,favouriteBlog
}