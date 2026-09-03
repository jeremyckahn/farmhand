import Button from '@mui/material/Button/index.js'
import Dialog from '@mui/material/Dialog/index.js'
import DialogActions from '@mui/material/DialogActions/index.js'
import DialogContent from '@mui/material/DialogContent/index.js'
import DialogTitle from '@mui/material/DialogTitle/index.js'
import Paper from '@mui/material/Paper/index.js'
import { useState } from 'react'

import uiEventHandlers from '../../handlers/ui-events.js'
import { moneyString } from '../../utils/moneyString.js'
import { Div, P } from '../Elements/index.js'
import FarmhandContext, { BoundHandlers } from '../Farmhand/Farmhand.context.js'
import { BOT_PLAYER_ID } from '../FarmhandShuffleView/FarmhandShuffleView.js'

export const FarmhandShuffleContextMenu = ({
  farmhandShuffle,
  playerId,
  handleSettleFarmhandShuffleMatch,
}: {
  farmhandShuffle: farmhand.state['farmhandShuffle']
  playerId: farmhand.state['playerId']
  handleSettleFarmhandShuffleMatch: BoundHandlers<
    typeof uiEventHandlers
  >['handleSettleFarmhandShuffleMatch']
}) => {
  const [isForfeitDialogOpen, setIsForfeitDialogOpen] = useState(false)

  const {
    isMatchInProgress,
    wager,
    totalWins,
    totalLosses,
    currentWinStreak,
  } = farmhandShuffle

  const handleForfeitConfirm = () => {
    handleSettleFarmhandShuffleMatch(BOT_PLAYER_ID, playerId)
    setIsForfeitDialogOpen(false)
  }

  return (
    <Div className="FarmhandShuffleContextMenu">
      <h2>Farmhand Shuffle</h2>
      <Paper
        sx={{
          padding: '1em',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75em',
        }}
      >
        {isMatchInProgress && (
          <P sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {wager > 0
              ? `Wager: ${moneyString(wager)} · Prize: ${moneyString(
                  wager * 2
                )}`
              : 'No wager placed · playing for fun'}
          </P>
        )}
        <Div sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <P>Wins: {totalWins}</P>
          <P>Losses: {totalLosses}</P>
        </Div>
        <P>Current win streak: {currentWinStreak}</P>
      </Paper>
      {isMatchInProgress && (
        <Button
          {...{
            color: 'error',
            variant: 'contained',
            onClick: () => setIsForfeitDialogOpen(true),
            sx: { marginTop: '1em', width: '100%' },
          }}
        >
          Forfeit Match
        </Button>
      )}
      <Dialog
        {...{
          className: 'Farmhand',
          open: isForfeitDialogOpen,
          onClose: () => setIsForfeitDialogOpen(false),
          maxWidth: 'xs',
        }}
      >
        <DialogTitle>Forfeit match?</DialogTitle>
        <DialogContent dividers>
          <p>
            Are you sure that you want to forfeit this match? You&apos;ll lose
            your {moneyString(wager)} wager and it will count as a loss.
          </p>
          <DialogActions>
            <Button
              autoFocus
              {...{
                color: 'primary',
                onClick: () => setIsForfeitDialogOpen(false),
              }}
            >
              Cancel
            </Button>
            <Button {...{ color: 'error', onClick: handleForfeitConfirm }}>
              Do it
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Div>
  )
}

export default function Consumer() {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <FarmhandShuffleContextMenu
          {...({ ...gameState, ...handlers } as Parameters<
            typeof FarmhandShuffleContextMenu
          >[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
