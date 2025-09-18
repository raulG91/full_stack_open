const PeopleList = ({people,onDelete}) => {
    return(
        <div>
        <h2>Numbers</h2>  
          {people.map((person)=>{
            return(
            <div key={person.id}>
              <p key={person.id}>{`${person.name} ${person.number}`}<button  value={person.id} type="button" onClick={onDelete}>Delete</button></p>
              
            </div>
            )
          })}
      </div>
    )
}

export default PeopleList