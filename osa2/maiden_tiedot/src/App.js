import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({filter, filterChange}) => {
  return(
    <div>
      find countries
      <input value={filter}
      onChange={filterChange}/>
    </div>
  )}

const OneCountry = ({country, api_key}) => {
  const languages = Object.values(country.languages)
  const [weather, setWeather] = useState({})

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
        console.log(response.data)
      })
  }, [country.capital, api_key])

  return(
    <>
      <h2>{country.name.common}</h2>
      Capital: {country.capital}
      <br></br>
      Area: {country.area}
      <h3>Languages:</h3>
      <ul>
        {languages.map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>
      <img src={country.flags.png} alt='flag' width='150' height='80'></img>
      <br></br>
      <h3>Weather in {country.capital} </h3>
      {weather.main ? <>Temperature {weather.main.temp} celcius</> : null}
      <br></br>
      {weather.weather ? <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
      alt='icon'></img> : null}
      <br></br>
      {weather.wind ? <>wind {weather.wind.speed} m/s</> : null}
    </>
  )}

const Content = ({countries, filter, api_key}) => {
  if (countries.length === 1) {
    return(
      <>
        <OneCountry country={countries[0]} api_key={api_key} />     
      </>
    )
  } else if (countries.length < 11) {
    return(
      <>
        {countries.map(country =>
        <div key={country.name.official}>{country.name.common} 
        <button key={country.name.official}
        type='button'
        onClick={() => filter(country.name.common)}>show</button>
        </div>
        )}
      </>
    )
  }else {
    return(
      <>
        Too many results, specify another filter
      </>
    )}}

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
  
  const countriesToShow = (filter === '')
  ? []
  : countries.filter(country => country.name.common.toLowerCase().includes(filter.toLocaleLowerCase()))

  const handleFilterChange = (event) =>{
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <Filter filter={filter} filterChange={handleFilterChange}/>
      <Content countries={countriesToShow} filter={setFilter} api_key={api_key}/>
    </div>
  )}

export default App;