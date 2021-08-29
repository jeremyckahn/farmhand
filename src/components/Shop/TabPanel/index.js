import React from 'react'
import { node, number } from 'prop-types'

export const TabPanel = props => {
  const { children, value, index, ...other } = props

  return (
    <section
      role="tabpanel"
      hidden={value !== index}
      id={`shop-tabpanel-${index}`}
      aria-labelledby={`shop-tab-${index}`}
      {...other}
    >
      {value === index ? children : null}
    </section>
  )
}

TabPanel.propTypes = {
  children: node,
  index: number.isRequired,
  value: number.isRequired,
}

export const a11yProps = index => ({
  id: `shop-tab-${index}`,
  'aria-controls': `shop-tabpanel-${index}`,
})
