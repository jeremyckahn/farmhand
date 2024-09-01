import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

import AccountBalanceIcon from '@mui/icons-material/AccountBalance.js'
import AssessmentIcon from '@mui/icons-material/Assessment.js'
import BeenhereIcon from '@mui/icons-material/Beenhere.js'
import BookIcon from '@mui/icons-material/Book.js'
import Button from '@mui/material/Button/index.js'
import Dialog from '@mui/material/Dialog/index.js'
import DialogActions from '@mui/material/DialogActions/index.js'
import DialogContent from '@mui/material/DialogContent/index.js'
import DialogTitle from '@mui/material/DialogTitle/index.js'
import Fab from '@mui/material/Fab/index.js'
import FlashOnIcon from '@mui/icons-material/FlashOn.js'
import FormControl from '@mui/material/FormControl/index.js'
import FormControlLabel from '@mui/material/FormControlLabel/index.js'
import FormGroup from '@mui/material/FormGroup/index.js'
import MenuItem from '@mui/material/MenuItem/index.js'
import Select from '@mui/material/Select/index.js'
import SettingsIcon from '@mui/icons-material/Settings.js'
import Switch from '@mui/material/Switch/index.js'
import TextField from '@mui/material/TextField/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import { array, bool, func, number, string } from 'prop-types'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import {
  doesInventorySpaceRemain,
  integerString,
  inventorySpaceConsumed,
} from '../../utils/index.js'
import { dialogView } from '../../enums.js'
import {
  DEFAULT_ROOM,
  INFINITE_STORAGE_LIMIT,
  STAGE_TITLE_MAP,
} from '../../constants.js'
import { MAX_ROOM_NAME_LENGTH } from '../../common/constants.js'

import AccountingView from '../AccountingView/index.js'
import AchievementsView from '../AchievementsView/index.js'
import LogView from '../LogView/index.js'
import OnlinePeersView from '../OnlinePeersView/index.js'
import PriceEventView from '../PriceEventView/index.js'
import SettingsView from '../SettingsView/index.js'
import StatsView from '../StatsView/index.js'
import KeybindingsView from '../KeybindingsView/index.js'

import DayAndProgressContainer from './DayAndProgressContainer.js'

import './Navigation.sass'

const FarmNameDisplay = ({ farmName, handleFarmNameUpdate }) => {
  const [displayedFarmName, setDisplayedFarmName] = useState(farmName)

  useEffect(() => {
    setDisplayedFarmName(farmName)
  }, [farmName, setDisplayedFarmName])

  return (
    <h2 className="farm-name">
      <TextField
        variant="standard"
        {...{
          inputProps: {
            maxLength: 12,
          },
          onChange: ({ target: { value } }) => {
            setDisplayedFarmName(value)
          },
          onBlur: ({ target: { value } }) => {
            handleFarmNameUpdate(value)
          },
          placeholder: 'Farm Name',
          value: displayedFarmName,
        }}
      />{' '}
      Farm
    </h2>
  )
}

const OnlineControls = ({
  activePlayers,
  handleActivePlayerButtonClick,
  handleChatRoomOpenStateChange,
  handleOnlineToggleChange,
  handleRoomChange,
  isChatAvailable,
  isOnline,
  room,
}) => {
  const [displayedRoom, setDisplayedRoom] = useState(room)

  useEffect(() => {
    setDisplayedRoom(room)
  }, [room, setDisplayedRoom])

  const handleChatButtonClick = () => {
    handleChatRoomOpenStateChange(true)
  }

  return (
    <>
      <FormControl
        variant="standard"
        {...{ className: 'online-control-container', component: 'fieldset' }}
      >
        <FormGroup {...{ className: 'toggle-container' }}>
          <FormControlLabel
            control={
              <Switch
                color="primary"
                checked={isOnline}
                onChange={handleOnlineToggleChange}
                name="use-alternate-end-day-button-position"
              />
            }
            label="Play online"
          />
        </FormGroup>
        <TextField
          variant="standard"
          {...{
            className: 'room-name',
            inputProps: {
              maxLength: MAX_ROOM_NAME_LENGTH,
            },
            label: 'Room name',
            onChange: ({ target: { value } }) => {
              setDisplayedRoom(value)
            },
            onBlur: ({ target: { value } }) => {
              handleRoomChange(value)
            },
            onKeyUp: ({ target: { value }, which }) => {
              // Enter
              if (which === 13) {
                handleRoomChange(value)
              }
            },
            value: displayedRoom,
            variant: 'outlined',
          }}
        />
      </FormControl>
      {activePlayers && (
        <>
          <Button
            {...{
              color: 'primary',
              onClick: handleActivePlayerButtonClick,
              variant: 'contained',
            }}
          >
            Connected players: {integerString(activePlayers)}
          </Button>
          {isChatAvailable ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleChatButtonClick}
            >
              Open chat
            </Button>
          ) : (
            <Typography className="chat-placeholder">
              Chat is available for online rooms other than "{DEFAULT_ROOM}"
            </Typography>
          )}
        </>
      )}
    </>
  )
}

const {
  FARMERS_LOG,
  PRICE_EVENTS,
  STATS,
  ACHIEVEMENTS,
  ACCOUNTING,
  SETTINGS,
  ONLINE_PEERS,

  // Has no UI trigger
  KEYBINDINGS,
} = dialogView

// The labels here must be kept in sync with mappings in initInputHandlers in
// Farmhand.js.
const dialogTriggerTextMap = {
  [FARMERS_LOG]: "Open Farmer's Log (l)",
  [PRICE_EVENTS]: 'See Price Events (e)',
  [STATS]: 'View your stats (s)',
  [ACHIEVEMENTS]: 'View Achievements (a)',
  [ACCOUNTING]: 'View Bank Account (b)',
  [SETTINGS]: 'View Settings (comma)',
}

const dialogTitleMap = {
  [FARMERS_LOG]: "Farmer's Log",
  [PRICE_EVENTS]: 'Price Events',
  [STATS]: 'Farm Stats',
  [ACHIEVEMENTS]: 'Achievements',
  [ACCOUNTING]: 'Bank Account',
  [SETTINGS]: 'Settings',
  [ONLINE_PEERS]: 'Active Players',

  // Has no UI trigger
  [KEYBINDINGS]: 'Keyboard Shortcuts',
}

const dialogContentMap = {
  [FARMERS_LOG]: <LogView />,
  [PRICE_EVENTS]: <PriceEventView />,
  [STATS]: <StatsView />,
  [ACHIEVEMENTS]: <AchievementsView />,
  [ACCOUNTING]: <AccountingView />,
  [SETTINGS]: <SettingsView />,
  [ONLINE_PEERS]: <OnlinePeersView />,

  // Has no UI trigger
  [KEYBINDINGS]: <KeybindingsView />,
}

export const Navigation = ({
  activePlayers,
  blockInput,
  currentDialogView,
  farmName,
  handleActivePlayerButtonClick,
  handleChatRoomOpenStateChange,
  handleClickDialogViewButton,
  handleCloseDialogView,
  handleDialogViewExited,
  handleFarmNameUpdate,
  handleOnlineToggleChange,
  handleRoomChange,
  handleViewChange,
  inventory,
  inventoryLimit,
  isChatAvailable,
  isDialogViewOpen,
  isOnline,
  room,
  stageFocus,
  viewList,

  currentDialogViewLowerCase = currentDialogView.toLowerCase(),
  modalTitleId = `${currentDialogViewLowerCase}-modal-title`,
  modalContentId = `${currentDialogViewLowerCase}-modal-content`,
}) => {
  return (
    <header className="Navigation">
      <h1>Farmhand</h1>
      <p className="version">
        v{import.meta.env?.VITE_FARMHAND_PACKAGE_VERSION}
      </p>
      <FarmNameDisplay {...{ farmName, handleFarmNameUpdate }} />
      <DayAndProgressContainer />
      <OnlineControls
        {...{
          activePlayers,
          handleActivePlayerButtonClick,
          handleChatRoomOpenStateChange,
          handleOnlineToggleChange,
          handleRoomChange,
          isChatAvailable,
          isOnline,
          room,
        }}
      />
      {inventoryLimit > INFINITE_STORAGE_LIMIT && (
        <h3
          {...{
            className: classNames('inventory-info', {
              'is-inventory-full': !doesInventorySpaceRemain({
                inventory,
                inventoryLimit,
              }),
            }),
          }}
        >
          Inventory: {integerString(inventorySpaceConsumed(inventory))} /{' '}
          {integerString(inventoryLimit)}
        </h3>
      )}

      <Select
        variant="standard"
        {...{
          className: 'view-select',
          onChange: handleViewChange,
          value: stageFocus,
        }}
      >
        {viewList.map((view, i) => (
          <MenuItem {...{ key: view, value: view }}>
            {i + 1}: {STAGE_TITLE_MAP[view]}
          </MenuItem>
        ))}
      </Select>
      <div className="button-array">
        {[
          { dialogView: FARMERS_LOG, Icon: BookIcon },
          { dialogView: PRICE_EVENTS, Icon: FlashOnIcon },
          { dialogView: STATS, Icon: AssessmentIcon },
          { dialogView: ACHIEVEMENTS, Icon: BeenhereIcon },
          { dialogView: ACCOUNTING, Icon: AccountBalanceIcon },
          { dialogView: SETTINGS, Icon: SettingsIcon },
        ].map(({ dialogView, Icon }) => (
          <Tooltip
            {...{
              arrow: true,
              key: dialogView,
              placement: 'top',
              title: dialogTriggerTextMap[dialogView],
            }}
          >
            <Fab
              {...{
                'aria-label': dialogTriggerTextMap[dialogView],
                color: 'primary',
                onClick: () => handleClickDialogViewButton(dialogView),
              }}
            >
              <Icon />
            </Fab>
          </Tooltip>
        ))}
      </div>
      {/*
    This Dialog gets the Farmhand class because it renders outside of the root
    Farmhand component. This explicit class maintains style consistency.
    */}
      <Dialog
        {...{
          className: classNames('Farmhand', { 'block-input': blockInput }),
          fullWidth: true,
          maxWidth: 'xs',
          onClose: handleCloseDialogView,
          open: isDialogViewOpen,
          TransitionProps: {
            onExited: handleDialogViewExited,
          },
        }}
        aria-describedby={modalTitleId}
        aria-labelledby={modalContentId}
      >
        <DialogTitle {...{ id: modalTitleId }}>
          {dialogTitleMap[currentDialogView]}
        </DialogTitle>
        <DialogContent {...{ id: modalContentId }}>
          {dialogContentMap[currentDialogView]}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogView} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </header>
  )
}

Navigation.propTypes = {
  activePlayers: number,
  blockInput: bool.isRequired,
  farmName: string.isRequired,
  handleClickDialogViewButton: func.isRequired,
  handleChatRoomOpenStateChange: func.isRequired,
  handleActivePlayerButtonClick: func.isRequired,
  handleCloseDialogView: func.isRequired,
  handleDialogViewExited: func.isRequired,
  handleFarmNameUpdate: func.isRequired,
  handleOnlineToggleChange: func.isRequired,
  handleRoomChange: func.isRequired,
  handleViewChange: func.isRequired,
  inventory: array.isRequired,
  inventoryLimit: number.isRequired,
  isChatAvailable: bool.isRequired,
  isDialogViewOpen: bool.isRequired,
  isOnline: bool.isRequired,
  stageFocus: string.isRequired,
  viewList: array.isRequired,
}

export default function Consumer(props) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Navigation {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
