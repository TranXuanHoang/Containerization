import { useEffect, useState } from 'react'
import './Fib.css'

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([])
  const [values, setValues] = useState({})
  const [index, setIndex] = useState('')
  const [fetchValuesError, setFetchValuesError] = useState('')
  const [fetchSeenIndexesEror, setFetchSeenIndexesEror] = useState('')

  useEffect(() => {
    const fetchValues = () => {
      fetch('/api/values/current')
        .then(response => response.json())
        .then(values => setValues(values))
        .catch(err => {
          console.error(err)
          setFetchValuesError('Failed to fetch Fibonacci numbers for the submitted indexes')
        })
    }

    const fetchIndexes = () => {
      fetch('/api/values/all')
        .then(response => response.json())
        .then(seenIndexes => setSeenIndexes(seenIndexes))
        .catch(err => {
          console.error(err)
          setFetchSeenIndexesEror('Failed to fetch all indexes that have been submitted')
        })
    }

    // Fetch Fibonacci numbers
    fetchValues()

    // Fetch indexes submitted
    fetchIndexes()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    await fetch('/api/values', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        index: index
      })
    })

    // Clear the input form
    setIndex('')
  }

  const renderSeenIndexes = () => {
    return seenIndexes.map(({ number }) => number).join(', ')
  }

  const renderValues = () => {
    const entries = []

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      )
    }

    return entries
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="Form">
        <label>Enter your index</label>
        <input
          value={index}
          onChange={e => setIndex(e.target.value)}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen</h3>
      {renderSeenIndexes()}
      {fetchSeenIndexesEror && <div className="Error">{fetchSeenIndexesEror}</div>}

      <h3>Calculated Values</h3>
      {renderValues()}
      {fetchValuesError && <div className="Error">{fetchValuesError}</div>}
    </div>
  )
}

export default Fib
