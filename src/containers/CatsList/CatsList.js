import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './CatsList.module.css'

const CatsList = () => {
  const [cats, setCats] = useState([])

  useEffect(() => {
    fetchCats()
  }, [])

  const fetchCats = async () => {
    const response = await axios.get(
      'https://api.thecatapi.com/v1/images/search?limit=5'
    )
    setCats(response.data)
  }

  return (
    <React.Fragment>
      <h1>Cats list</h1>
      <button type="button" onClick={fetchCats}>
        I want new cats!
      </button>
      <ul>
        {cats.map(cat => (
          <li key={cat.id}>
            <img
              className={styles.Cat}
              width="300"
              height="200"
              src={cat.url}
              alt="Cat"
            />
          </li>
        ))}
      </ul>
    </React.Fragment>
  )
}

export default CatsList
