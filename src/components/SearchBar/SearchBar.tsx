import React from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import TextField from '@mui/material/TextField/index.js'

import { Div } from '../Elements/index.js'
import { pixelBevel, pixelFrameSx } from '../../styles/pixel.js'
import { colors, layout } from '../../styles/tokens.js'

const SearchBar = ({
  placeholder,
  onSearch,
}: {
  placeholder?: string
  onSearch: (value: string) => void
}) => {
  const debouncedSearch = useDebounceCallback((value: string) => {
    onSearch(value)
  }, 300)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value)
  }

  return (
    <Div
      className="search-bar"
      sx={{
        position: 'relative',
        maxWidth: layout.cardMaxWidth,
        padding: '0.5em',
        margin: '1em auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...pixelFrameSx({ outline: colors.cardOutline, shadow: true }),
        backgroundColor: '#fff',
        boxShadow: pixelBevel({ highlight: 'rgba(0, 0, 0, 0.06)' }),
        '& .MuiOutlinedInput-root': {
          width: '100%',
          fontSize: '1em',
          backgroundColor: 'transparent',
          transition: 'all 0.3s ease',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffd24d',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffb913',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            transition: 'border-color 0.3s ease',
          },
          '& input': {
            color: '#333',
            caretColor: '#333',
            transition: 'background-color 0.3s ease',
            '&:focus': { backgroundColor: '#fff' },
          },
          '& input::placeholder': {
            color: '#999',
            transition: 'color 0.3s ease',
          },
        },
        '@media (max-width: 768px)': {
          padding: '1em',
          margin: '0.5em auto',
          '& .MuiOutlinedInput-root': { fontSize: '0.9em' },
        },
      }}
    >
      <TextField
        variant="outlined"
        fullWidth
        placeholder={placeholder || 'Search...'}
        onChange={handleInputChange}
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </Div>
  )
}

export default SearchBar
