import React, { useState, useEffect } from 'react'
import classNames from 'classnames'

import AccountBalanceIcon from '@material-ui/icons/AccountBalance'
import AssessmentIcon from '@material-ui/icons/Assessment'
import BeenhereIcon from '@material-ui/icons/Beenhere.js'
import BookIcon from '@material-ui/icons/Book'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Fab from '@material-ui/core/Fab'
import FlashOnIcon from '@material-ui/icons/FlashOn'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import SettingsIcon from '@material-ui/icons/Settings'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import { array, bool, func, number, object, string } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'
import {
  doesInventorySpaceRemain,
  farmProductSalesVolumeNeededForLevel,
  farmProductsSold,
  integerString,
  inventorySpaceConsumed,
  levelAchieved,
  scaleNumber,
} from '../../utils'
import { dialogView } from '../../enums'
import { STAGE_TITLE_MAP } from '../../constants'
import { MAX_ROOM_NAME_LENGTH } from '../../common/constants'

import AccountingView from '../AccountingView'
import AchievementsView from '../AchievementsView'
import LogView from '../LogView'
import OnlinePeersView from '../OnlinePeersView'
import PriceEventView from '../PriceEventView'
import SettingsView from '../SettingsView'
import StatsView from '../StatsView'
import KeybindingsView from '../KeybindingsView'

import './Navigation.sass'

const FarmNameDisplay = ({ farmName, handleFarmNameUpdate }) => {
  const [displayedFarmName, setDisplayedFarmName] = useState(farmName)

  useEffect(() => {
    setDisplayedFarmName(farmName)
  }, [farmName, setDisplayedFarmName])

  return (
    <h2 className="farm-name">
      <TextField
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
  handleOnlineToggleChange,
  handleRoomChange,
  isOnline,
  room,
}) => {
  const [displayedRoom, setDisplayedRoom] = useState(room)

  useEffect(() => {
    setDisplayedRoom(room)
  }, [room, setDisplayedRoom])

  return (
    <>
      <FormControl
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
        <Button
          {...{
            color: 'primary',
            onClick: handleActivePlayerButtonClick,
            variant: 'contained',
          }}
        >
          Active players: {integerString(activePlayers)}
        </Button>
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
  currentDialogView,
  dayCount,
  farmName,
  handleActivePlayerButtonClick,
  handleClickDialogViewButton,
  handleCloseDialogView,
  handleDialogViewExited,
  handleFarmNameUpdate,
  handleOnlineToggleChange,
  handleRoomChange,
  handleViewChange,
  inventory,
  inventoryLimit,
  itemsSold,
  isDialogViewOpen,
  isOnline,
  room,
  stageFocus,
  viewList,

  totalFarmProductsSold = farmProductsSold(itemsSold),
  currentLevel = levelAchieved(totalFarmProductsSold),
  levelPercent = scaleNumber(
    totalFarmProductsSold,
    farmProductSalesVolumeNeededForLevel(currentLevel),
    farmProductSalesVolumeNeededForLevel(currentLevel + 1),
    0,
    100
  ),
}) => (
  <header className="Navigation">
    <h1>Farmhand</h1>
    <p className="version">v{process.env.REACT_APP_VERSION}</p>
    <FarmNameDisplay {...{ farmName, handleFarmNameUpdate }} />
    <h2 className="day-and-progress-container">
      <span>Day {integerString(dayCount)}, level:</span>
      <Tooltip
        {...{
          arrow: true,
          placement: 'top',
          title: `${integerString(
            farmProductSalesVolumeNeededForLevel(currentLevel + 1) -
              totalFarmProductsSold
          )} more sales needed for level ${integerString(currentLevel + 1)}`,
        }}
      >
        <Box>
          <CircularProgress
            {...{
              value: levelPercent,
              variant: 'determinate',
            }}
          />
          <span {...{ className: 'current-level' }}>
            {integerString(currentLevel)}
          </span>
        </Box>
      </Tooltip>
    </h2>
    <OnlineControls
      {...{
        activePlayers,
        handleActivePlayerButtonClick,
        handleOnlineToggleChange,
        handleRoomChange,
        isOnline,
        room,
      }}
    />
    {inventoryLimit > -1 && (
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
        className: 'Farmhand',
        fullWidth: true,
        maxWidth: 'xs',
        onClose: handleCloseDialogView,
        open: isDialogViewOpen,
        onExited: handleDialogViewExited,
      }}
    >
      <DialogTitle>{dialogTitleMap[currentDialogView]}</DialogTitle>
      <DialogContent>{dialogContentMap[currentDialogView]}</DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialogView} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  </header>
)

Navigation.propTypes = {
  activePlayers: number,
  dayCount: number.isRequired,
  farmName: string.isRequired,
  handleClickDialogViewButton: func.isRequired,
  handleActivePlayerButtonClick: func.isRequired,
  handleCloseDialogView: func.isRequired,
  handleDialogViewExited: func.isRequired,
  handleFarmNameUpdate: func.isRequired,
  handleOnlineToggleChange: func.isRequired,
  handleRoomChange: func.isRequired,
  handleViewChange: func.isRequired,
  inventory: array.isRequired,
  inventoryLimit: number.isRequired,
  itemsSold: object.isRequired,
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
