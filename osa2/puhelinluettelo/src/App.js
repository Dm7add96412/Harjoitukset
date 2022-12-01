import { useState } from 'react'

const Persons = ({numbers}) => {
  return(
    <>
      {numbers.map(person =>
      <Phonebook key={person.name} person={person} />
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

const Phonebook = ({person}) => {
  return(
    <>
    {person.name} {person.number}
    <br></br>
    </> 
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setFilter] = useState('')

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    if(!persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
    } else {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
    }
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
      <Persons numbers={numbersToShow}/>
    </div>
  )
}

export default App