import React from 'react'

// This is a general-use error boundary component that will simply not render
// its children if there is an error within its tree.

// Adapted from https://reactjs.org/docs/error-boundaries.html#introducing-error-boundaries
class BailOutErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}

BailOutErrorBoundary.propTypes = {}

export default BailOutErrorBoundary
