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

const Header = (props) => {
  return(
    <>
      <h1>{props.h}</h1>
    </>
  )
}

const theVotes = (voted) => {
  return(
    Math.max(...voted)
  )
}

const theIndex = (voted, mvoted) => {
  return(
    voted.indexOf(mvoted)
  )
}

const MostVotes = (props) => {
  const most = theVotes(props.v)
  const index = theIndex(props.v, most)

  if (props.v.length === 0) {
    return(
      <>
        No votes yet
      </>
    )
  }
  return(
    <>
      {props.anecdote[index]}
      <br></br>
      has {most} votes
    </>

  )
}

const Content = (props) => {
  if (props.counting === 0) {
    return (
      <>
        {props.anecdote}
        <br></br>
        No votes yet!
        <br></br>
      </>
    )
  }
  return (
    <>
      {props.anecdote} 
      <br></br>
      has {props.counting} votes
      <br></br>
    </>
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

  const [selected, setSelected] = useState(0)
  const [voted, setVote] = useState(new Uint8Array(7))

  const headers = {
    header1: 'Anecdote of the day',
    header2: 'Anecdote with most votes'
  }

  const setToValue = newValue => {
    newValue = Randomizer(0, 6)
    console.log('next anecdote', (newValue + 1))
    setSelected(newValue)
  }

  const setToVote = newValue => {
    var copy = [...newValue]
    copy[selected] += 1
    console.log('votes', copy)
    setVote(copy)
  }

  return (
    <div>
      <Header h={headers.header1} />
      <Content counting={voted[selected]} anecdote={anecdotes[selected]} />
      <Button handleClick={() => setToValue(selected)} text="next anecdote" />
      <Button handleClick={() => setToVote(voted)} text="vote" />
      <Header h={headers.header2} />
      <MostVotes v={voted} anecdote={anecdotes} />

    </div>
  )
}

export default App
