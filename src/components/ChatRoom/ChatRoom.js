import React, { useContext } from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'

import FarmhandContext from '../Farmhand/Farmhand.context'

export const ChatRoom = () => {
  const dialogTitleId = 'chat-title'
  const dialogContentId = 'chat-content'

  const {
    handlers: { handleChatRoomOpenStateChange },
    gameState: { isChatOpen },
  } = useContext(FarmhandContext)

  const handleChatRoomClose = () => {
    handleChatRoomOpenStateChange(false)
  }

  return (
    <Dialog
      {...{
        className: classNames('Farmhand'),
        fullWidth: true,
        maxWidth: 'xs',
        open: isChatOpen,
      }}
      aria-describedby={dialogTitleId}
      aria-labelledby={dialogContentId}
    >
      <DialogTitle {...{ disableTypography: true }}>
        <Typography {...{ id: dialogTitleId, component: 'h2', variant: 'h6' }}>
          Chat room
        </Typography>
      </DialogTitle>
      <DialogContent {...{ id: dialogContentId }}>
        <p>Chat goes here!</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleChatRoomClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
