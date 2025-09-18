import { useState, useEffect, use } from 'react'
import axios from 'axios'
import CountryDisplay from './components/CountryDisplay'

function App() {

  const [searchValue, setValue] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all') // Fetch data from API
      .then(response => {
        const countriesArray = response.data.map(country=> country.name.common.toLowerCase())
        setCountries(countriesArray) // Set the fetched data to state
      })
      .catch(error => {
        console.error('Error fetching data:', error) // Log any errors
      })

  }, [])
  useEffect(() => {
    if(filteredCountries.length === 1){
      // Fetch the data for that country
      axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${filteredCountries[0]}`).then(response =>{
        console.log(response.data)
        setSelectedCountry(response.data)
      }).catch(error => {
        console.error('Error fetching data:', error) // Log any errors
      })
    }
  },[filteredCountries])

  //console.log(countries)
  const handleOnChange = (event) => {
    const newValue = event.target.value
    setValue(newValue) // Get value from input field
    if(countries.length === 0) return

    if(newValue.length === 0){
      setFilteredCountries([])
      return
    }
    const filteredCountries = countries.filter(country => country.includes(newValue.toLowerCase()))
    setFilteredCountries(filteredCountries)
    console.log(filteredCountries)
  }
  const handleShowCountry = (event) =>{
    const country = event.target.value
    console.log(country)
    setFilteredCountries([country])
  }
  return ( 
    <div>
      <input type="text" value={searchValue} placeholder="Search for a country..."  onChange={handleOnChange}/>
      {filteredCountries.length > 10 ? <p>Too many matches, specify another filter</p>: null}
      {filteredCountries.length <=10 && filteredCountries.length > 1 ? 
        <div>
        <ul>
          {filteredCountries.map((country,index)=> <li key={index}>{country}<button type='text' value={country} onClick={handleShowCountry}>Show</button></li>)}
        </ul> </div> :null}
        {filteredCountries.length === 1 ? <CountryDisplay country={selectedCountry}/> : null}
      
    </div>
  )
}

export default App
