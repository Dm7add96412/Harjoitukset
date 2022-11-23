const Course = ({course}) => {
    return(
    <>
      <Header name={course.name}/>
      <Content parts={course.parts}/>
    </>
    )
  }
  
const Header = ({ name }) => <h2>{name}</h2>

const Total = ({ parts }) => {
let sum = parts.reduce((acc, curr) => acc + curr.exercises, 0)
return(
    <p><b>Total of {sum} exercises</b></p>
)
}

const Part = ({name, exercises}) => 
<p>{name} {exercises}</p>

const Content = ({ parts }) => {
return(
<>
    {parts.map(part=>{
    return(
        <Part name={part.name} exercises={part.exercises} key={part.id}/>
    )})} 
    <Total parts={parts} />
</>
)
}

export default Course