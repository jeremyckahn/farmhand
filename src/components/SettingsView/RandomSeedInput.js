import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'

import './RandomSeedInput.sass'
import { randomNumberService } from '../../common/services/randomNumber'

export const RandomSeedInput = () => {
  const [seed, setSeed] = useState('')
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

    if (seed === '') {
      randomNumberService.unseedRandomNumber()
    } else {
      randomNumberService.seedRandomNumber(seed)
    }
  }

  return (
    <form className="RandomSeedInput" onSubmit={handleSubmit}>
      <TextField
        value={seed}
        variant="filled"
        label="Random number seed"
        onChange={handleChange}
      />
    </form>
  )
}
