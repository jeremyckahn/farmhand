import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import classNames from 'classnames'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import FarmhandContext from '../Farmhand/Farmhand.context'

import './ChatRoom.sass'

const chitchatterDomain = 'https://chitchatter.im'

export const ChatRoom = () => {
  const dialogTitleId = 'chat-title'
  const dialogContentId = 'chat-content'

  const {
    handlers: { handleChatRoomOpenStateChange },
    gameState: { id, isChatOpen, room },
  } = useContext(FarmhandContext)

  const handleChatRoomClose = () => {
    handleChatRoomOpenStateChange(false)
  }

  const chatRoomComponent = (
    // @ts-ignore
    <chat-room
      root-url={chitchatterDomain}
      room={`__farmhand__${room}`}
      user-id={id}
      style={{ height: '100%', width: '100%', border: 'none' }}
      color-mode="light"
    />
  )

  return (
    <>
      <Helmet>
        <script src={`${chitchatterDomain}/sdk.js`} />
      </Helmet>
      <Dialog
        {...{
          className: classNames('Farmhand', 'ChatRoom'),
          fullWidth: true,
          keepMounted: true,
          fullScreen: true,
          open: isChatOpen,
          onClose: handleChatRoomClose,
        }}
        aria-describedby={dialogTitleId}
        aria-labelledby={dialogContentId}
      >
        <DialogTitle id={dialogTitleId}>Chat room</DialogTitle>
        <DialogContent {...{ id: dialogContentId }}>
          {chatRoomComponent}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChatRoomClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
