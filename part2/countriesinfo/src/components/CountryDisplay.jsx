const CountryDisplay = ({ country }) => {
    if(!country) return null
    const languages = country.languages
    return(
    <div>
        <h1>{country.name.common}</h1>
        <p>Capital: {country.capital}</p>
        <p> Area: {country.area}</p>
        <h2>Languages</h2>
        <ul>
            {Object.keys(languages).map((key) => (
                <li key={key}>{languages[key]}</li>
            ))}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="200"/>
    </div>
    )


}

export default CountryDisplay