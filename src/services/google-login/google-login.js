import { GoogleOAuthProvider } from 'google-oauth-gsi'

export const googleProvider = new GoogleOAuthProvider({
  clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID ?? '',
  onScriptLoadError: () => console.log('onScriptLoadError'),
  onScriptLoadSuccess: () => console.log('onScriptLoadSuccess'),
})
