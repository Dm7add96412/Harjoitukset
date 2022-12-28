const Filter = ({filtering, filterChange}) => {
    return(
      <div>
        filter shown with
        <input value={filtering}
        onChange={filterChange}/>
      </div>
    )
  }

const Persons = ({numbers, remove}) => {
    if (numbers) {
    return(
      <>
        {numbers.map(person =>
        <Phonebook key={person.name} person={person} remove={remove} />
        )}
      </>
    )} else {
      console.log("Could not get numbers")
//      console.log(numbers)
    }
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

const Phonebook = ({person, remove}) => {
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

export default {Filter, PersonForm, Persons}