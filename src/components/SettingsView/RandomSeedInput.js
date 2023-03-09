import React, { useContext, useState } from 'react'
import window from 'global/window'
import TextField from '@material-ui/core/TextField'

import './RandomSeedInput.sass'
import FarmhandContext from '../Farmhand/Farmhand.context'

export const RandomSeedInput = () => {
  const {
    handlers: { handleRNGSeedChange },
  } = useContext(FarmhandContext)

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

    handleRNGSeedChange(seed)
  }

  return (
    <form className="RandomSeedInput" onSubmit={handleSubmit}>
      <TextField
        value={seed}
        variant="outlined"
        label="Random number seed"
        onChange={handleChange}
        inputProps={{
          maxLength: 30,
        }}
      />
    </form>
  )
}
