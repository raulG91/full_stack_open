const Blog = require('../models/blog')
const User = require('../models/user')

const initalEntries = [
    {
        "title": "First blog",
        "author": "Raúl Garcia",
        "url": "https://localhost.com",
        likes: 10
    },
    {
        "title": "Second blog",
        "author": "Raúl Garcia",
        "url": "https://localhost.com",
        likes: 20
    }
]

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog=>blog.toJSON())

}
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
  }
const tokenRetrival = async (api,username, password) => {
    const response = await api
        .post('/api/login')
        .send({ username, password })
    return response.body.token
}
const blogUser = async () =>{
    
}
module.exports = {
    initalEntries,
    blogsInDB,
    usersInDb,
    tokenRetrival
}