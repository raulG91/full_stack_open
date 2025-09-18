const Header = (props) => {

    return (
      <>
        <h2>{props.name}</h2>
      </>
  
    )
  }
  const Part = (props) => {
    return (
      <>
        <p>{props.name} {props.exercises}</p>
      </>
    )
  }
  const Content = ({parts}) => {
  
    return (
      <div>
        {parts.map((part)=><Part name={part.name} exercises={part.exercises} key={part.id} />)}
      </div>
  
  
    )
  }
  const Total = ({parts}) => {
  
    return (
      <>
        <p>Number of exercises {parts.reduce((accumulator,current_value)=>accumulator+current_value.exercises,0)}</p>
      </>
  
    )
  
  }
  const Course = ({course}) =>{
  
    return(
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
  
      </div>
    )
  }

  export default Course