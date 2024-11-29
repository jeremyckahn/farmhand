import React from 'react'
import PropTypes from 'prop-types'
import { useDebounceCallback } from 'usehooks-ts'
import TextField from '@mui/material/TextField/index.js'
import './SearchBar.sass'

const SearchBar = ({ placeholder, onSearch }) => {
  const debouncedSearch = useDebounceCallback(value => {
    onSearch(value)
  }, 300)

  const handleInputChange = event => {
    debouncedSearch(event.target.value)
  }

  return (
    <div className="search-bar">
      <TextField
        variant="outlined"
        fullWidth
        placeholder={placeholder || 'Search...'}
        onChange={handleInputChange}
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </div>
  )
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
}

export default SearchBar
