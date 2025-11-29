const { test, after, beforeEach, describe, before } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { initalEntries, blogsInDB, tokenRetrival } = require('./test_helper')
const { url } = require('node:inspector')

const api = supertest(app)

let token = ''
let userDB = null
describe('Blog API tests', async () => {
    before(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(initalEntries)
        userDB = await User.findOne({ username: 'raul_test' })
        //console.log("User found in DB:", userDB.username)
        if (userDB){
            await User.deleteMany({ username: 'raul_test' })
        }
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'raul_test', passwordHash })
        userDB = await user.save()
        const loginResponse = await api
            .post('/api/login')
            .send({ username: 'raul_test', password: 'sekret' })
    
        token = `Bearer ${loginResponse.body.token}`
        console.log("Token retrieved:", token)
    })
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(initalEntries)

    })
    test('Blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('Specific entry is returned', async () => {
        const response = await api.get('/api/blogs')
        const blogTitles = response.body.map(r => r.title)
        assert.strictEqual(blogTitles.includes('First blog'), true)


    })
    test('Test blog without likes defaulted to 0', async () => {
        const newBlog = {
            "title": "Test blog without likes",
            "author": "Raul Garcia",
            "url": "https://localhost.com"
        }
        await api.post('/api/blogs').send(newBlog).set('Authorization', token).expect(201).expect('Content-Type', /application\/json/)
        const blogs = await blogsInDB()
        const blogCreated = blogs.find(element => element.title === 'Test blog without likes')
        assert.strictEqual(blogCreated.likes, 0)

    })
    test('POST without title and url', async () => {
        const newFailedBlog = {
            "author": "Raul Garcia",
            "likes": 0
        }
        await api.post('/api/blogs').send(newFailedBlog).set('Authorization', token).expect(400)
    })
    test('Update blog entry likes', async () => {
        const blogAtStart = await blogsInDB()
        const blogToUpdate = blogAtStart[0]
        const updatedBlogData = {
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: blogToUpdate.likes + 10
        }
        await api.put(`/api/blogs/${blogToUpdate.id}`).send(updatedBlogData).expect(200).expect('Content-Type', /application\/json/)
        //Read DB blogs after the update
        const blogsAtEnd = await blogsInDB()
        const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
        assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 10)
    })
    
    test('Delete a blog entry', async () => {
        const newBlog = {
            "title": "Blog to delete",
            "author": "Raul Garcia",
            "url": "https://localhost.com"
        }
        const result = await api.post('/api/blogs').send(newBlog).set('Authorization', token).expect(201).expect('Content-Type', /application\/json/)
        const blogToDelete = result.body
        const blogsAtStart = await blogsInDB()
        await api.delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', token).expect(204)
        const blogsAtEnd = await blogsInDB()
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
        const titles = blogsAtEnd.map(r => r.title)
        assert.strictEqual(titles.includes(blogToDelete.title), false)
    })

})
after(async () => {
    await mongoose.connection.close()
})