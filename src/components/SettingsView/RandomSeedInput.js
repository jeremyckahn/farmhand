import React, { useState } from 'react'
import window from 'global/window'
import TextField from '@material-ui/core/TextField'

import './RandomSeedInput.sass'
import { randomNumberService } from '../../common/services/randomNumber'

export const RandomSeedInput = () => {
  const [seed, setSeed] = useState(
    new URLSearchParams(window.location.search).get('seed') ?? ''
  )

  /**
   * @param {React.SyntheticEvent<HTMLInputElement>} e
   */
  const handleChange = e => {
    setSeed(e.target.value)
  }

  /**
   * @param {React.SyntheticEvent<HTMLFormElement>} e
   */
  const handleSubmit = e => {
    e.preventDefault()

    const { origin, pathname, search, hash } = window.location
    const queryParams = new URLSearchParams(search)

    if (seed === '') {
      randomNumberService.unseedRandomNumber()
      queryParams.delete('seed')
    } else {
      randomNumberService.seedRandomNumber(seed)
      queryParams.set('seed', seed)
    }

    const newQueryParams = queryParams.toString()
    const newSearch = newQueryParams.length > 0 ? `?${newQueryParams}` : ''

    const newUrl = `${origin}${pathname}${newSearch}${hash}`
    window.history.replaceState({}, '', newUrl)
  }

  return (
    <form className="RandomSeedInput" onSubmit={handleSubmit}>
      <TextField
        value={seed}
        variant="outlined"
        label="Random number seed"
        onChange={handleChange}
      />
    </form>
  )
}
