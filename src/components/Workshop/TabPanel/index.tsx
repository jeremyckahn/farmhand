import React from 'react'
import { node, number } from 'prop-types'

interface TabPanelProps {
  children?: React.ReactNode
  value: number
  index: number
  [key: string]: any
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
    <section
      role="tabpanel"
      hidden={value !== index}
      id={`workshop-tabpanel-${index}`}
      aria-labelledby={`workshop-tab-${index}`}
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

export const a11yProps = (index: number) => ({
  id: `workshop-tab-${index}`,
  'aria-controls': `workshop-tabpanel-${index}`,
})
