import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Persons = ({numbers, remove}) => {
  return(
    <>
      {numbers.map(person =>
      <Phonebook key={person.name} person={person} remove={remove} />
      )}
    </>
  )
}

const PersonForm = ({name, nameValue, numberValue,
nameChange, numberChange}) => {

  return(
    <form onSubmit={name}>
    <div>
      name: 
      <input value={nameValue} 
      onChange={nameChange}
      />
    </div>
    <div>
      number:
      <input value={numberValue}
      onChange={numberChange}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Filter = ({filtering, filterChange}) => {
  return(
    <div>
      filter shown with
      <input value={filtering}
      onChange={filterChange}/>
    </div>
  )
}

const Phonebook = ({person, remove}) => {
  // onClick={() => remove(person.id)}
  const youSure = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      remove(person.id)
    }
  }
  return(
    <>
    {person.name} {person.number}
    <button key={person.name} onClick={() => youSure(person)}>delete</button>
    <br></br>
    </> 
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')

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
          })
      } else {
        setNewName('')
        setNewNumber('')
      }}}

  const removePerson = (id) => {
    personService
      .remove(id)
        .then(returned => {
          setPersons(persons.filter(person => person.id !== id))
          console.log('remove run:', returned)
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
      <Filter filtering={newFilter}
      filterChange={handleFilterChange}/>
      <h2>Add a new</h2>
      <PersonForm name={addName}
      nameValue={newName}
      numberValue={newNumber}
      nameChange={handleNameChange}
      numberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons numbers={numbersToShow} remove={removePerson}/>
    </div>
  )
}

export default App