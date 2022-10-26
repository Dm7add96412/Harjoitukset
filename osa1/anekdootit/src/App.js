import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Randomizer = (min, max) => {
  return(
    Math.floor(Math.random() * (max - min + 1)) + min
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]

  const votes = new Uint8Array(7)
   
  const [selected, setSelected] = useState(0)
  const [voted, setVote] = useState(0)

  const setToValue = newValue => {
    newValue = Randomizer(0, 6)
    console.log('next anecdote', newValue)
    setSelected(newValue)
  }

  const setToVote = newValue => {
    if (votes.every(item => item === 0)) {
      var copy = [...votes]
      copy[selected] += 1
      setVote(newValue)
      console.log(copy)
    }
    else {
    copy[selected] += 1
    setVote(newValue)
    console.log(copy)
    }
  }

  return (
    <div>
      <>{anecdotes[selected]}</>
      <p></p>
      <Button handleClick={() => setToValue(selected)} text="next anecdote" />
      <Button handleClick={() => setToVote(voted)} text="vote" />

    </div>
  )
}

export default App
