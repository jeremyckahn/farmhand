import React from 'react'
import { node, number } from 'prop-types'

export const TabPanel = (
  props: React.PropsWithChildren<
    { value: number; index: number } & Record<string, unknown>
  >
) => {
  const { children, value, index, ...other } = props

  return (
    <section
      role="tabpanel"
      hidden={value !== index}
      id={`cow-context-tabpanel-${index}`}
      aria-labelledby={`cow-context-tab-${index}`}
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
  id: `cow-context-tab-${index}`,
  'aria-controls': `cow-context-tabpanel-${index}`,
})
