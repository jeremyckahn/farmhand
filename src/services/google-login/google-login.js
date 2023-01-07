import { GoogleOAuthProvider } from 'google-oauth-gsi'

import { GOOGLE_PROMPT_PARENT_ID } from '../../constants'

export const googleProvider = new GoogleOAuthProvider({
  clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID ?? '',
  onScriptLoadError: () => console.log('onScriptLoadError'),
  onScriptLoadSuccess: () => {
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID ?? '',
      auto_select: true,
      prompt_parent_id: GOOGLE_PROMPT_PARENT_ID,
    })
  },
})

export const oneTapLogin = googleProvider.useGoogleOneTapLogin({
  cancel_on_tap_outside: true,
  onSuccess: res => console.log('Logged in with google', res),
})
