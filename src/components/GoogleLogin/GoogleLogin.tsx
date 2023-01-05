import React, { useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { GoogleOAuthProvider } from 'google-oauth-gsi'

const googleProvider = new GoogleOAuthProvider({
  clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID ?? '',
  onScriptLoadError: () => console.log('onScriptLoadError'),
  onScriptLoadSuccess: () => console.log('onScriptLoadSuccess'),
})

const login = googleProvider.useGoogleLogin({
  flow: 'auth-code',
  onSuccess: res => console.log('Logged in with google', res),
  onError: err => console.error('Failed to login with google', err),
})

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

  const handleEnableCloudSaveClick = () => {
    // https://medium.com/@willikay11/how-to-link-your-react-application-with-google-drive-api-v3-list-and-search-files-2e4e036291b7
    const { gapi } = window

    const initClient = async () => {
      try {
        login()
      } catch (e) {
        console.error(e)
        return
      }
    }

    gapi.load('client:auth2', initClient)
  }

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
