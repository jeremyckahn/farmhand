import { useContext, useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

import FarmhandContext from '../Farmhand/Farmhand.context'

const UpdateNotifier = () => {
  const {
    handlers: { handleGameUpdateAvailable },
  } = useContext(FarmhandContext)

  const {
    needRefresh: [appNeedsUpdate],
    updateServiceWorker,
  } = useRegisterSW()

  useEffect(() => {
    if (!appNeedsUpdate) {
      return
    }

    handleGameUpdateAvailable(updateServiceWorker)

    // NOTE: This ensures the game is updated when the user next opensit.
    window.addEventListener('beforeunload', () => {
      updateServiceWorker(true)
    })
  }, [appNeedsUpdate, handleGameUpdateAvailable, updateServiceWorker])

  return null
}

export default UpdateNotifier
