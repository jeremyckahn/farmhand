import React, { useContext } from 'react'
import { Helmet } from 'react-helmet'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Typography from '@material-ui/core/Typography'

import FarmhandContext from '../Farmhand/Farmhand.context'

// FIXME: Use stable domain
const chitchatterDomain =
  'https://chitchatter-git-feature-sdk-jeremyckahn.vercel.app'

export const ChatRoom = () => {
  const dialogTitleId = 'chat-title'
  const dialogContentId = 'chat-content'

  const {
    handlers: { handleChatRoomOpenStateChange },
    gameState: { id, isChatOpen },
  } = useContext(FarmhandContext)

  const handleChatRoomClose = () => {
    handleChatRoomOpenStateChange(false)
  }

  // FIXME: Add the room name
  // FIXME: Keep the chat component mounted while the player is online
  const chatRoomComponent = (
    // @ts-ignore
    <chat-room
      root-url={chitchatterDomain}
      user-id={id}
      style={{ minHeight: 300 }}
    />
  )

  return (
    <>
      <Helmet>
        <script src={`${chitchatterDomain}/sdk.js`} />
      </Helmet>
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
          <Typography
            {...{ id: dialogTitleId, component: 'h2', variant: 'h6' }}
          >
            Chat room
          </Typography>
        </DialogTitle>
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
