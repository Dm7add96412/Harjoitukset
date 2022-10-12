import { useState } from 'react'

const Header = (props) => {
  return (
    <>
      <h1>{props.nimi}</h1>   
    </>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Average = (props) => {
  const neg = props.b - (props.b * 2)
  const n = (neg + props.g) / (props.g + props.n + props.b)
  return (
    <>
      <StatisticLine text="average" value={n}/>   
    </>
  )
}

const Positive = (props) => {
  const p = props.g / (props.g + props.n + props.b) * 100
  return (
    <>
      <StatisticLine text="positive" value={p}/>
      
    </>
  )
}

const All = (props) => {
  const a = props.g + props.n + props.b
  return(
    <>
      <StatisticLine text="all" value={a}/>
    </>
  )
}

const StatisticLine = (props) => {
  if (props.text === "positive") {
    return(
      <>
        <td>{props.text}</td>
        <td>{props.value}%</td>
    </>
    )
  } 
  return(
    <>
      <td>{props.text}</td>
      <td>{props.value}</td>

    </>
  )
}

const Statistics = (props) => {
  if (props.b + props.n + props.g === 0) {
    return(
      <>
        <p>No feedback given</p>
      </>
    )
  }
  return(
    <>
      <table>
        <tbody>
          <tr>
            <StatisticLine text="good" value={props.g}/>
          </tr>
          <tr>
            <StatisticLine text="neutral" value={props.n}/>
          </tr>
          <tr>
            <StatisticLine text="bad" value={props.b}/>
          </tr>
          <tr>
            <All b={props.b} g={props.g} n={props.n}/>
          </tr>
          <tr>
            <Average b={props.b} g={props.g} n={props.n}/>
          </tr>
          <tr>
            <Positive b={props.b} g={props.g} n={props.n}/>
          </tr>
        </tbody>
      </table>
    </>
  )
}

const Content = (props) => {
  return (
    <>
      <Statistics b={props.b} g={props.g} n={props.n}/>
    </>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const otsakkeet = {
    otsikko1: 'give feedback',
    otsikko2: 'statistics'
  }
  const setToValueG = newValue => {
    console.log('good value now', newValue)
    setGood(newValue)
  }
  const setToValueN = newValue => {
    console.log('neutral value now', newValue)
    setNeutral(newValue)
  }
  const setToValueB = newValue => {
    console.log('bad value now', newValue)
    setBad(newValue)
  }

  return (
    <div>
      <Header nimi={otsakkeet.otsikko1} />
      <Button handleClick={() => setToValueG(good + 1)} text="good" />
      <Button handleClick={() => setToValueN(neutral + 1)} text="neutral" />
      <Button handleClick={() => setToValueB(bad + 1)} text="bad" />
      <Header nimi={otsakkeet.otsikko2} />
      <Content g={good} n={neutral} b={bad} />
    </div>
  )
}

export default App