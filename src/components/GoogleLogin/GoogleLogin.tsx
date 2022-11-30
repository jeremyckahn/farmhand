import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

export const GoogleLogin = () => {
  const [hasLoadedGapi, setHasLoadedGapi] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (hasLoadedGapi) return

      const { getGapi } = await import('gapi-browser')

      await getGapi

      setHasLoadedGapi(true)
    })()
  }, [hasLoadedGapi])

  const handleEnableCloudSaveClick = () => {}

  return hasLoadedGapi ? (
    <Button
      {...{
        color: 'primary',
        onClick: handleEnableCloudSaveClick,
        variant: 'contained',
      }}
    >
      Enable cloud save with Google Drive
    </Button>
  ) : (
    <CircularProgress variant="indeterminate" />
  )
}
