import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'
import { GoogleOAuthProvider } from 'google-oauth-gsi'

const googleProvider = new GoogleOAuthProvider({
  clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID ?? '',
  onScriptLoadError: () => console.log('onScriptLoadError'),
  onScriptLoadSuccess: () => console.log('onScriptLoadSuccess'),
})

export const GoogleLogin = () => {
  const [hasLoadedGapi, setHasLoadedGapi] = useState(false)
  const logInButtonRef = useRef<HTMLButtonElement>(null)
  const [userWantsToUseGoogle, setUserWantsToUseGoogle] = useState(false)

  useEffect(() => {
    const { current: logInButton } = logInButtonRef

    if (!logInButton) return

    const renderButton = googleProvider.useRenderButton({
      useOneTap: true,
      auto_select: true,
      element: logInButton,
      prompt_parent_id: 'google-log-in-container',
      onError: () => console.error('Failed to render button'),
      onSuccess: res =>
        console.log('Logged in with google (render button)', res),
    })

    renderButton()
  }, [logInButtonRef, userWantsToUseGoogle])

  useEffect(() => {
    ;(async () => {
      if (hasLoadedGapi) return

      const { getGapi } = await import('gapi-browser')

      await getGapi

      setHasLoadedGapi(true)
    })()
  }, [hasLoadedGapi])

  const handleEnableCloudSaveClick = () => {
    setUserWantsToUseGoogle(true)
  }

  return userWantsToUseGoogle ? (
    <>
      <Button ref={logInButtonRef} />
      {/* FIXME: Move this somewhere global such as the menu */}
      <div id="google-log-in-container"></div>
    </>
  ) : (
    <Button
      {...{
        color: 'primary',
        onClick: handleEnableCloudSaveClick,
        variant: 'contained',
      }}
    >
      Enable cloud save with Google Drive
    </Button>
  )
}
