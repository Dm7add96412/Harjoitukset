import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const handleChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    })

    setNewNote('')
  }

  return (
    <div>
      <h2>Add a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleChange}
          placeholder='write note content here'
          id='note-input'
        />
        <input
          value={{}}
          onChange={() => {}}
          placeholder='this is a test'
        />
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

export default NoteForm