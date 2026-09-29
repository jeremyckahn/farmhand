import React, { useContext, useState } from 'react'
import globalWindow from 'global/window.js'
import TextField from '@mui/material/TextField/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { Form } from '../Elements/index.js'

export interface RandomSeedInputProps {
  search?: string
}

export const RandomSeedInput = ({
  search = globalWindow.location.search,
}: RandomSeedInputProps) => {
  const {
    handlers: { handleRNGSeedChange },
  } = useContext(FarmhandContext)

  const [seed, setSeed] = useState(
    new URLSearchParams(search).get('seed') ?? ''
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(e.target.value)
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    handleRNGSeedChange(seed)
  }

  return (
    <Form
      className="RandomSeedInput"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', justifyContent: 'center' }}
    >
      <TextField
        value={seed}
        variant="outlined"
        label="Random number seed"
        onChange={handleChange}
        inputProps={{
          maxLength: 30,
        }}
      />
    </Form>
  )
}
