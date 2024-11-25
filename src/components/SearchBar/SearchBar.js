import React from 'react'
import PropTypes from 'prop-types'
import './SearchBar.sass'

const SearchBar = ({ placeholder, onSearch }) => {
  const handleInputChange = event => {
    onSearch(event.target.value)
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder || 'Search...'}
        onChange={handleInputChange}
      />
    </div>
  )
}

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
}

export default SearchBar
