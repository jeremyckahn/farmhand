import React, { useContext, useState } from 'react'
import { string } from 'prop-types'
import window from 'global/window'
import TextField from '@mui/material/TextField'

import FarmhandContext from '../Farmhand/Farmhand.context'

import './RandomSeedInput.sass'

export const RandomSeedInput = ({ search = window.location.search }) => {
  const {
    handlers: { handleRNGSeedChange },
  } = useContext(FarmhandContext)

  const [seed, setSeed] = useState(
    new URLSearchParams(search).get('seed') ?? ''
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

RandomSeedInput.propTypes = {
  search: string,
}
