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

  const handleEnableCloudSaveClick = () => {
    // https://medium.com/@willikay11/how-to-link-your-react-application-with-google-drive-api-v3-list-and-search-files-2e4e036291b7
    const { gapi } = window

    // Array of API discovery doc URLs for APIs
    const DISCOVERY_DOCS = [
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    ]

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    const SCOPES = 'https://www.googleapis.com/auth/drive.appdata'

    const initClient = async () => {
      // setIsLoadingGoogleDriveApi(true)

      try {
        await gapi.client.init({
          apiKey: process.env.REACT_APP_GOOGLE_DRIVE_API_KEY,
          clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        })
      } catch (e) {
        console.error(e)
        return
      }

      console.log(gapi)

      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(isSignedIn => {
        console.log({ isSignedIn })
      })

      // Handle the initial sign-in state.
      // updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
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
