const Header = (props) => {
  return (
    <>
      <h1>{props.kurssi}</h1>   
    </>
  )
}

const Part = (props) => {
  return (
    <>
      <p>{props.oh} {props.har}</p>
    </>
  )
}

const Content = (props) => {
  return (
    <>
      <Part oh={osa1} har={harkka1} />
      <Part oh={osa2} har={harkka2} />
      <Part oh={osa3} har={harkka3} />
    </>
  )
}

const Total = (props) => {
  return (
    <>
      <p>Number of exercises {props.e1 + props.e2 + props.e3}</p>
    </>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header kurssi={course} />
      <Content osa1={part1} harkka1={exercises1} osa2={part2} harkka2={exercises2} osa3={part3} harkka3={exercises3} />
      <Total e1={exercises1} e2={exercises2} e3={exercises3} />
    </div>
  )
}

export default App