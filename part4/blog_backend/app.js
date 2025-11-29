const express = require('express'); 
const {PORT, MONGODB_URI} = require('./utils/config')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const {errorHandler,tokenExtractor} = require('./utils/middleware')

const app = express();
app.use(express.json())
app.use(tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
console.log('connecting to', MONGODB_URI)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.info('connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connection to MongoDB:', error.message)
  })

app.use(errorHandler)

module.exports = app
