const e = require('express')
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://rgarciapedrosa_db_user:${password}@cluster0.q4pwgy0.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)
if(process.argv.length==5){
  //There are 5 arguments, we need to add a new person
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  person.save().then(result => {
    console.log(`Add ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}
else if(process.argv.length==3){
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  }) 
}

