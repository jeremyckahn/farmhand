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
      id={`shop-tabpanel-${index}`}
      aria-labelledby={`shop-tab-${index}`}
      {...other}
    >
      {value === index ? children : null}
    </section>
  )
}

export const a11yProps = (index: number) => ({
  id: `shop-tab-${index}`,
  'aria-controls': `shop-tabpanel-${index}`,
})
