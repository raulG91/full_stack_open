const {test, after, beforeEach, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

const api = supertest(app)

describe('User API tests', async()=>{
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
    
        await user.save()
    })
    test('User creation succeeds with a fresh username', async()=>{
        const userAtStart = await helper.usersInDb()
        console.log("Users at start",userAtStart)
        const newUser = {
            "username": "testuser",
            "name": "Test User",
            "password": "securepassword"
        }
        const savedUser = await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, userAtStart.length + 1)
    })
    test('User creation fails with short password', async()=>{
        const newUser = {
            "username": "shortpassuser",
            "name": "Short Pass User",
            "password": "pw"
        }
        const result =  await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
        assert.strictEqual(result.body.error, 'Password is required and must be at least 3 characters long')
    })
    test('Username that already exists fails to be created', async()=>{
        const newUser = {
            "username": "root",
            "name": "Test User",
            "password": "securepassword"
        }
        const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)
        assert.strictEqual(result.body.error.includes('expected `username` to be unique'), true)
    })


})

after(async () => {
  await mongoose.connection.close()
})