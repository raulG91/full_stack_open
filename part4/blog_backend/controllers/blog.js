const express = require('express');
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
const {userExtractor} = require('../utils/middleware');

const blogRouter = express.Router();

blogRouter.get('/',async (req,res)=>{
    const blogs = await Blog.find({}).populate('user',{id:1,username:1,name:1})
    return res.json(blogs).status(200)
})

blogRouter.post('/',userExtractor,async (req,res)=>{
    const blog = new Blog(req.body)
    const decodedToken = jwt.verify(req.token, process.env.SECRET)   
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const user = req.user
    if(!user){
        return res.status(401).json({ error: 'User not found' })
    }
    if(!blog.title){
        return res.status(400).json({"error":"Missing title"})
    }
    else if(!blog.url){
        return  res.status(400).json({"error":"Missing url"})
    }
    blog.user = user._id
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()
    return res.status(201).json(result)
})
blogRouter.delete('/:id',userExtractor,async (req,res)=>{
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    // Search the user making the delete request
    const user = req.user
    if(!user){
        return res.status(401).json({ error: 'User not found' })
    }
    //Search the blog to delete
    const blogDelete = await Blog.findById(req.params.id)
    if(!blogDelete){
        return res.status(404).json({"error":"Blog not found"})
    }
    //Check if the user is the owner of the blog
    if(blogDelete.user.toString() !== user._id.toString()){
        return res.status(403).json({"error":"User not authorized to delete this blog"})
    }
    await Blog.findByIdAndDelete(req.params.id)
    return res.status(204).end()
})
blogRouter.put('/:id', async (req,res)=>{
    const blog = await Blog.findById(req.params.id)
    if(!blog){
        return res.status(404).json({"error":"Blog not found"})
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true, runValidators: true, context: 'query',returnDocument: 'after'}
    )
    return res.status(200).json(updatedBlog)
})


module.exports = blogRouter;