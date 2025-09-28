require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./model/person.js')


const app = express()
const PORT = process.env.PORT || 3000

/*let persons = [
  {
    'id': '1',
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': '2',
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': '3',
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': '4',
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
]*/
/*function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}*/
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
//Middleware to serve static files, html in this case
app.use(express.static('dist'))
app.get('/api/persons', (req, res) => {
  Person.find({}).then(resutls => {
    res.json(resutls).status(200)
  }
  )
})
app.get('/api/persons/:id', (req, res,next) => {

  Person.findById(req.params.id).then(person => {
    if(person){
      res.json(person).status(200)
    }
    else{
      res.status(404).end()
    }
  }).catch(error => {
    next(error)
  })
})
app.delete('/api/persons/:id', (req, res,next) => {

  Person.findByIdAndDelete(req.params.id).then(result => {
    res.status(204).end()
  }).catch(error => {
    next(error)
  })
})
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}
))
app.post('/api/persons', (req, res,next) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number is missing' })
  }
  /*
    const personExists = persons.find(p => p.name === body.name)
    if (personExists) {
        return res.status(400).json({ error: 'name must be unique' })
    }
    const person = {
        id: getRandomInt(10000).toString(),
        name: body.name,
        number: body.number
    }
    persons.push(person)
    return res.status(201).json(person)
*/
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    res.json(savedPerson).status(201)
  }).catch(error => {
    next(error)
  })
})
app.put('/api/persons/:id', (req, res,next) => {

  Person.findByIdAndUpdate(
    req.params.id,
    { number: req.body.number },
    { new: true, runValidators: true, context: 'query' }
  ).then(updatedPerson => {
    res.json(updatedPerson).status(200)
  }).catch(error => next(error))

})
app.get('/info', (req, res, next) => {

  Person.find({}).then(persons => {
    console.log(persons)
    res.setHeader('Content-Type', 'text/html')
    res.send(`<p>Phonebook has  info for ${persons.length}  people </p> <p>${new Date()} </p>`)

  }).catch(error => next(error))
})
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
app.listen(PORT, () => {
  console.log(`Server running on  http://localhost:${PORT}`)
})