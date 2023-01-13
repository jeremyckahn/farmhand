import { GoogleOAuthProvider } from 'google-oauth-gsi'

import { GOOGLE_PROMPT_PARENT_ID } from '../../constants'

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = [
  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
]

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.file'

export const googleProvider = new GoogleOAuthProvider({
  clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID ?? '',
  onScriptLoadError: () => console.log('onScriptLoadError'),
  onScriptLoadSuccess: () => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID ?? '',
      auto_select: true,
      prompt_parent_id: GOOGLE_PROMPT_PARENT_ID,
      callback: async () => {
        const { getGapi } = await import('gapi-browser')

        await getGapi

        const { gapi, google } = window

        const tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        })

        gapi.load('client', async () => {
          await gapi.client.init({
            apiKey: process.env.REACT_APP_GOOGLE_DRIVE_API_KEY,
            discoveryDocs: DISCOVERY_DOCS,
          })

          console.log({ tokenClient, gapi })
        })
      },
    })
  },
})

export const oneTapLogin = googleProvider.useGoogleOneTapLogin({
  cancel_on_tap_outside: true,
  onSuccess: res => console.log('Logged in with google', res),
})
