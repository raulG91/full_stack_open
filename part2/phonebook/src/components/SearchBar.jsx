const SearchBar = ({value,onChange}) =>{
    return(
        <div>
        <label>filter shown with</label><input value={value} onChange={onChange}/>
      </div>
    )
}

export default SearchBar