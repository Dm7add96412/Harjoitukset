import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import Components from './components/Components'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')
  const [newMessage, setNewMessage] = useState(null)
  const [newError, setNewError] = useState(false)

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log(response.data)
        setPersons(response.data)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    if(!persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      personService
        .add(nameObject)
          .then(returnedObject => {
          setPersons(persons.concat(returnedObject))
          setNewName('')
          setNewNumber('')
          setNewMessage(`Added ${newName}`)
          setTimeout(() => {
            setNewMessage(null)
          }, 5000)
          })
    } else {
      if (window.confirm(`${newName} is already added to the phonebook, 
      replace the old number with a new one?`)) {
        const person = persons.find(p => p.name.toLowerCase() === newName.toLocaleLowerCase())
        const changedPerson = {...person, number: newNumber}

        personService
          .update(person.id, changedPerson)
          .then(returnedObject => {
            setPersons(persons.map(per => 
              per.name.toLocaleLowerCase() !== person.name.toLocaleLowerCase()
              ? per : returnedObject))
            setNewName('')
            setNewNumber('')
            setNewMessage(`Updated ${newName} with a new number`)
            setTimeout(() => {
              setNewMessage(null)
            }, 5000)
          })
          .catch(error => {
            setNewError(true)
            setNewMessage(`Information of ${person.name} has already been removed from the server`)
            setPersons(persons.filter(p => p.id !== person.id))
            setTimeout(() => {
              setNewMessage(null)
              setNewError(false)
            }, 5000)
          })
      } else {
        setNewName('')
        setNewNumber('')
      }}}

  const removePerson = (id) => {
    const removedp = persons.find(person => person.id === id)
    personService
      .remove(id)
        .then(returned => {
          setPersons(persons.filter(person => person.id !== id))
          console.log('remove run:', returned)
          setNewMessage(`Removed ${removedp.name}`)
          setTimeout(() => {
            setNewMessage(null)
          }, 5000)
        })
        .catch(error => {
          setNewError(true)
          setNewMessage(`Already removed ${removedp.name}`)
          setPersons(persons.filter(person => person.id !== id))
          setTimeout(() => {
            setNewMessage(null)
            setNewError(false)
          }, 5000)
        })
  }

  const numbersToShow = (newFilter === '')
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={newMessage} error={newError}/>
      <Components.Filter filtering={newFilter}
      filterChange={handleFilterChange}/>
      <h2>Add a new</h2>
      <Components.PersonForm name={addName}
      nameValue={newName}
      numberValue={newNumber}
      nameChange={handleNameChange}
      numberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Components.Persons numbers={numbersToShow} remove={removePerson}/>
    </div>
  )
}

export default App