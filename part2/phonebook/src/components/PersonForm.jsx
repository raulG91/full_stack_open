const PersonForm = ({ name, onChangeName,number,onChangeNumber, onSubmit }) => {
    return(

        <form>
        <h2>Add a new</h2>
        <div>
          <label>Name:</label>
          <input value = {name} onChange={onChangeName}/>
        </div>
        <div>
          <label>Number:</label>
          <input  value={number} onChange={onChangeNumber} />
        </div>
        <div>
          <button type='submit' onClick={onSubmit}>Add</button>
        </div>
      </form>
    )
}

export default PersonForm