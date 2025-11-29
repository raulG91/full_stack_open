const bcrypt = require('bcrypt');
const User = require('../models/user');
const userRouter = require('express').Router();

userRouter.post('/', async (req,res)=>{

    const {username, name, password} = req.body

    if(!password || password.length < 3){
        return res.status(400).json({"error": 'Password is required and must be at least 3 characters long'})
    }
    const saltRounds = 10
    const passwordHash  = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })
    const savedUser = await user.save() 
    res.status(201).json(savedUser)
})
userRouter.get('/', async (req, res)=>{
    const users = await User.find({})
    res.status(200).json(users)
})
userRouter.get('/', async (req, res)=>{
    const users = await User.find({}).populate('blogs',{id:1,title:1,author:1,url:1,likes:1})
    return res.status(200).json(users)
})
module.exports = userRouter