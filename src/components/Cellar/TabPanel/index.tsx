import React from 'react'

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
      id={`cellar-tabpanel-${index}`}
      aria-labelledby={`cellar-tab-${index}`}
      {...other}
    >
      {value === index ? children : null}
    </section>
  )
}

export const a11yProps = (index: number) => ({
  id: `cellar-tab-${index}`,
  'aria-controls': `cellar-tabpanel-${index}`,
})
