import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar.jsx'
import PersonForm from './components/PersonForm.jsx'
import PeopleList from './components/PeopleList.jsx'
import phoneService from './services/phoneBook.js'
import Notification  from './components/Notification.jsx'


function App() {
  const [persons, setPersons] = useState([])
  const [newPhone, setPhone] = useState('')
  const [newName, setNewName] = useState('')
  const [searchName, setNameSearch] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')
  //useEffect is used to fetch data from the server when the component is rendered
  useEffect(() => {
    console.log('effect')
    phoneService.getAll().then(persons => {
      setPersons(persons)
    })

  }, [])
  const personToShow = searchName.length == 0 ? persons : persons.filter((person) => person.name.toLowerCase() === searchName.toLowerCase())
  const handleOnChange = (event) => {
    setNewName(event.target.value)
  }
  const handleOnChangePhone = (event) => {
    setPhone(event.target.value)
  }
  const handleOnSubmit = (event) => {
    //Prevent default action for form
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      const confirm = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if(confirm){
        const existingPerson = persons.find(p => p.name === newName)
        const updatedPerson = {...existingPerson, number: newPhone}
        phoneService.update(updatedPerson.id, updatedPerson).then(returnedPerson => {
          setPersons(persons.map(p => p.id !== updatedPerson.id ? p : returnedPerson))
          setNewName('')
          setPhone('')
          setNotificationType('success')
          setNotificationMessage(`Updated ${returnedPerson.name}'s number successfully`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        }).catch(error =>{
          setNotificationType('error')
          setNotificationMessage(`Information about ${newName} has not found in the server`)
        })
      }
      return
    }
    const personObject = {
      name: newName,
      number: newPhone
    }
    phoneService.create(personObject).then((personCreated) => {
      setPersons(persons.concat(personCreated))
      setNewName('')
      setPhone('')
      setNotificationType('success')
      setNotificationMessage(`${personCreated.name}'s number successfully created`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }).catch(error => {
      setNotificationType('error')
      setNotificationMessage(error.response.data.error)
        })

  }
  const handleOnChangeSearch = (event) => {
    setNameSearch(event.target.value)
  }
  const handleOnDelete=(event) =>{

    const id = event.target.value
    const existingPerson = persons.find(p => p.id === id)

    if(existingPerson){
      let confirm = window.confirm("Are you sure you want to delete this contact?")

      if(confirm){
        console.log("Deleting: ",event.target.value)
        phoneService.deletePerson(id).then(()=>{
          console.log("Deleted successfully")
          setPersons(persons.filter(p => p.id !== id))
        })
      }
    }
 
    
  }
  return (
    <>
      <div>
        <h2>Phonebook</h2>
        <Notification message={notificationMessage} type={notificationType} />
        <SearchBar value={searchName} onChange={handleOnChangeSearch} />
        <PersonForm name={newName} onChangeName={handleOnChange} number={newPhone} onChangeNumber={handleOnChangePhone} onSubmit={handleOnSubmit}  />
        <PeopleList people={personToShow} onDelete={handleOnDelete} />
      </div>
    </>
  )
}

export default App
