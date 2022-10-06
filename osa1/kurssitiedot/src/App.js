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
      <Part oh={props.osat1[0].name} har={props.osat1[0].exercises} />
      <Part oh={props.osat1[1].name} har={props.osat1[1].exercises} />
      <Part oh={props.osat1[2].name} har={props.osat1[2].exercises} />

    </>
  )
}

const Total = (props) => {
  return (
    <>
      <p>Number of exercises {props.osat2[0].exercises + props.osat2[1].exercises + props.osat2[2].exercises}</p>
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header kurssi={course.name} />
      <Content osat1={course.parts} />
      <Total osat2={course.parts} />
    </div>
  )
}

export default App