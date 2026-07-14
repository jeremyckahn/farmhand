import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import AccountBalanceIcon from '@mui/icons-material/AccountBalance.js'
import AssessmentIcon from '@mui/icons-material/Assessment.js'
import BeenhereIcon from '@mui/icons-material/Beenhere.js'
import BookIcon from '@mui/icons-material/Book.js'
import FlashOnIcon from '@mui/icons-material/FlashOn.js'
import SettingsIcon from '@mui/icons-material/Settings.js'
import Button from '@mui/material/Button/index.js'
import Dialog from '@mui/material/Dialog/index.js'
import DialogActions from '@mui/material/DialogActions/index.js'
import DialogContent from '@mui/material/DialogContent/index.js'
import DialogTitle from '@mui/material/DialogTitle/index.js'
import Fab from '@mui/material/Fab/index.js'
import FormControl from '@mui/material/FormControl/index.js'
import FormControlLabel from '@mui/material/FormControlLabel/index.js'
import FormGroup from '@mui/material/FormGroup/index.js'
import MenuItem from '@mui/material/MenuItem/index.js'
import Select from '@mui/material/Select/index.js'
import Switch from '@mui/material/Switch/index.js'
import TextField from '@mui/material/TextField/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import { array, bool, func, number, string } from 'prop-types'

import { MAX_ROOM_NAME_LENGTH } from '../../common/constants.js'
import {
  DEFAULT_ROOM,
  INFINITE_STORAGE_LIMIT,
  STAGE_TITLE_MAP,
} from '../../constants.js'
import { dialogView } from '../../enums.js'
import { doesInventorySpaceRemain } from '../../utils/doesInventorySpaceRemain.js'
import { integerString } from '../../utils/integerString.js'
import { inventorySpaceConsumed } from '../../utils/inventorySpaceConsumed.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'

import { breakpoints, colors } from '../../styles/tokens.js'
import AccountingView from '../AccountingView/index.js'
import AchievementsView from '../AchievementsView/index.js'
import { H3, Header } from '../Elements/index.js'
import KeybindingsView from '../KeybindingsView/index.js'
import LogView from '../LogView/index.js'
import OnlinePeersView from '../OnlinePeersView/index.js'
import PriceEventView from '../PriceEventView/index.js'
import SettingsView from '../SettingsView/index.js'
import StatsView from '../StatsView/index.js'

import DayAndProgressContainer from './DayAndProgressContainer.js'

const FarmNameDisplay = ({
  farmName,
  handleFarmNameUpdate,
}: {
  farmName: string
  handleFarmNameUpdate: (name: string) => void
}) => {
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
}: {
  activePlayers: number | null
  handleActivePlayerButtonClick: () => void
  handleChatRoomOpenStateChange: (open: boolean) => void
  handleOnlineToggleChange: (checked: boolean) => void
  handleRoomChange: (newRoom: string) => void
  isChatAvailable: boolean
  isOnline: boolean
  room: string
}) => {
  const [displayedRoom, setDisplayedRoom] = useState(room)

  useEffect(() => {
    setDisplayedRoom(room)
  }, [room, setDisplayedRoom])

  const handleChatButtonClick = () => {
    handleChatRoomOpenStateChange(true)
  }

  const submitRoomNameChange = () => {
    handleRoomChange(displayedRoom)
  }

  const handleSwitchChange = (checked: boolean) => {
    submitRoomNameChange()
    handleOnlineToggleChange(checked)
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
                onChange={(_, checked) => {
                  handleSwitchChange(checked)
                }}
                name="play-online"
              />
            }
            label="Play online"
          />
        </FormGroup>
        <TextField
          {...{
            className: 'room-name',
            inputProps: {
              maxLength: MAX_ROOM_NAME_LENGTH,
            },
            label: 'Room name',
            onChange: ({ target: { value } }) => {
              setDisplayedRoom(value)
            },
            onKeyUp: ({ key }) => {
              if (key === 'Enter') {
                submitRoomNameChange()
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

const dialogTitleMap: Partial<Record<farmhand.dialogView, string>> = {
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

const dialogContentMap: Partial<Record<
  farmhand.dialogView,
  React.ReactNode
>> = {
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

  currentDialogViewLowerCase = (currentDialogView || '').toLowerCase(),
  modalTitleId = `${currentDialogViewLowerCase}-modal-title`,
  modalContentId = `${currentDialogViewLowerCase}-modal-content`,
}: {
  activePlayers: number | null
  blockInput: boolean
  currentDialogView: farmhand.dialogView | null
  farmName: string
  handleActivePlayerButtonClick: () => void
  handleChatRoomOpenStateChange: (open: boolean) => void
  handleClickDialogViewButton: (view: farmhand.dialogView) => void
  handleCloseDialogView: () => void
  handleDialogViewExited: () => void
  handleFarmNameUpdate: (name: string) => void
  handleOnlineToggleChange: (checked: boolean) => void
  handleRoomChange: (newRoom: string) => void
  handleViewChange: (event: any) => void
  inventory: farmhand.state['inventory']
  inventoryLimit: number
  isChatAvailable: boolean
  isDialogViewOpen: boolean
  isOnline: boolean
  room: string
  stageFocus: string
  viewList: string[]
  currentDialogViewLowerCase?: string
  modalTitleId?: string
  modalContentId?: string
}) => {
  return (
    <Header
      className="Navigation"
      sx={{
        flexDirection: 'column',
        flexShrink: 0,
        display: 'flex',
        '& .version': {
          fontFamily: '"Francois One", sans-serif',
          textAlign: 'center',
        },
        '& .farm-name': {
          lineHeight: '1.3em',
          margin: '0.25em 0',
          '& .MuiInput-root': {
            background: 'none',
            margin: 0,
            '& input': {
              fontFamily: '"Francois One"',
              paddingLeft: '0.5em',
              paddingRight: '0.5em',
              textAlign: 'center',
            },
          },
        },
        '& .online-control-container': {
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          margin: '1em 0',
          '& .toggle-container': { minWidth: '155px' },
        },
        '& .button-array': {
          marginLeft: '3em',
          marginRight: '3em',
          [`@media (max-width: ${breakpoints.smallPhone}px)`]: {
            marginLeft: '2em',
            marginRight: '2em',
          },
        },
        '& .current-level': {
          alignItems: 'center',
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          userSelect: 'none',
        },
        '& h1': {
          fontSize: '3em',
          fontWeight: 'bold',
          [`@media (max-width: ${breakpoints.smallPhone}px)`]: {
            fontSize: '2.5em',
          },
        },
        '& button': { fontSize: '1.3em', margin: '0.3em', minWidth: '56px' },
        '& h1, & h2, & h3': { textAlign: 'center' },
        '& .day-and-progress-container': {
          alignItems: 'center',
          display: 'flex',
          fontSize: '1.5em',
          margin: '0.5em auto',
          '& .MuiBox-root': {
            display: 'inline-flex',
            marginLeft: '0.5em',
            position: 'relative',
          },
        },
        '& .inventory-info': { fontSize: '1em' },
        '& .MuiSelect-select': { padding: '1em' },
        '& .chat-placeholder': {
          fontSize: '0.75em',
          padding: '0.5em 0',
          textAlign: 'center',
        },
      }}
    >
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
        <H3
          {...{
            className: classNames('inventory-info', {
              'is-inventory-full': !doesInventorySpaceRemain({
                inventory,
                inventoryLimit,
              }),
            }),
          }}
          sx={{
            color: !doesInventorySpaceRemain({ inventory, inventoryLimit })
              ? colors.error
              : undefined,
          }}
        >
          Inventory: {integerString(inventorySpaceConsumed(inventory))} /{' '}
          {integerString(inventoryLimit)}
        </H3>
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
            {i + 1}: {STAGE_TITLE_MAP[view as keyof typeof STAGE_TITLE_MAP]}
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
        ].map(({ dialogView: dialogViewType, Icon }) => (
          <Tooltip
            {...{
              arrow: true,
              key: dialogViewType,
              placement: 'top',
              title: dialogTriggerTextMap[dialogViewType],
            }}
          >
            <Fab
              {...{
                'aria-label': dialogTriggerTextMap[dialogViewType],
                color: 'primary',
                onClick: () => handleClickDialogViewButton(dialogViewType),
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
          {currentDialogView ? dialogTitleMap[currentDialogView] : ''}
        </DialogTitle>
        <DialogContent {...{ id: modalContentId }}>
          {currentDialogView ? dialogContentMap[currentDialogView] : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogView} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Header>
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

export default function Consumer(
  props: Partial<Parameters<typeof Navigation>[0]>
) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <Navigation
          {...({
            ...gameState,
            ...handlers,
            ...props,
          } as Parameters<typeof Navigation>[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
