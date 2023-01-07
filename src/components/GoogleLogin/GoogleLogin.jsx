import React, { useEffect, useState, useRef } from 'react'
import Button from '@material-ui/core/Button'

import { GOOGLE_PROMPT_PARENT_ID } from '../../constants.js'
import { googleProvider } from '../../services/google-login'

import './GoogleLogin.sass'

export const GoogleLogin = () => {
  const [hasLoadedGapi, setHasLoadedGapi] = useState(false)
  const logInButtonRef = useRef(null)

  useEffect(() => {
    const { current: logInButton } = logInButtonRef

    if (!logInButton) return

    const renderButton = googleProvider.useRenderButton({
      useOneTap: true,
      auto_select: true,
      element: logInButton,
      prompt_parent_id: GOOGLE_PROMPT_PARENT_ID,
      theme: 'filled_blue',
      onError: () => console.error('Failed to render button'),
      onSuccess: res =>
        console.log('Logged in with google (render button)', res),
    })

    renderButton()
  }, [logInButtonRef])

  useEffect(() => {
    ;(async () => {
      if (hasLoadedGapi) return

      const { getGapi } = await import('gapi-browser')

      await getGapi

      setHasLoadedGapi(true)
    })()
  }, [hasLoadedGapi])

  return <Button className="GoogleLogin" ref={logInButtonRef} />
}
