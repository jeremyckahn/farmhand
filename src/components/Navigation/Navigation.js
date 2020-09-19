import React from 'react'
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Fab from '@material-ui/core/Fab'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn'
import HistoryIcon from '@material-ui/icons/History'
import FlashOnIcon from '@material-ui/icons/FlashOn'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import AttachMoneyIcon from '@material-ui/icons/AttachMoney'
import Tooltip from '@material-ui/core/Tooltip'
import { array, bool, func, number, object, string } from 'prop-types'

import FarmhandContext from '../../Farmhand.context'
import {
  doesInventorySpaceRemain,
  farmProductsSold,
  integerString,
  inventorySpaceConsumed,
  levelAchieved,
} from '../../utils'
import { dialogView } from '../../enums'
import { STAGE_TITLE_MAP } from '../../constants'

import LogView from '../LogView'
import PriceEventView from '../PriceEventView'
import AchievementsView from '../AchievementsView'
import StatsView from '../StatsView'
import AccountingView from '../AccountingView'

import './Navigation.sass'

const {
  FARMERS_LOG,
  PRICE_EVENTS,
  ACHIEVEMENTS,
  STATS,
  ACCOUNTING,
} = dialogView

const dialogTriggerTextMap = {
  [FARMERS_LOG]: "Open Farmer's Log (l)",
  [PRICE_EVENTS]: 'See Price Events (p)',
  [ACHIEVEMENTS]: 'View Achievements (a)',
  [STATS]: 'View your stats (d)',
  [ACCOUNTING]: 'View Bank Account (b)',
}

const dialogTitleMap = {
  [FARMERS_LOG]: "Farmer's Log",
  [PRICE_EVENTS]: 'Price Events',
  [ACHIEVEMENTS]: 'Achievements',
  [STATS]: 'Farm Stats',
  [ACCOUNTING]: 'Bank Account',
}

const dialogContentMap = {
  [FARMERS_LOG]: <LogView />,
  [PRICE_EVENTS]: <PriceEventView />,
  [ACHIEVEMENTS]: <AchievementsView />,
  [STATS]: <StatsView />,
  [ACCOUNTING]: <AccountingView />,
}

export const Navigation = ({
  currentDialogView,
  dayCount,
  handleClickDialogViewButton,
  handleCloseDialogView,
  handleDialogViewExited,
  handleViewChange,
  inventory,
  inventoryLimit,
  itemsSold,
  isDialogViewOpen,
  purchasedCowPen,
  stageFocus,
  viewList,

  totalFarmProductsSold = farmProductsSold(itemsSold),
  currentLevel = levelAchieved(totalFarmProductsSold),
}) => (
  <header className="Navigation">
    <h1>Farmhand</h1>
    <h2 className="day-count">
      Day {dayCount}, level {integerString(currentLevel)}
    </h2>
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
        Inventory: {inventorySpaceConsumed(inventory)} / {inventoryLimit}
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
        { dialogView: FARMERS_LOG, Icon: HistoryIcon },
        { dialogView: PRICE_EVENTS, Icon: FlashOnIcon },
        { dialogView: ACHIEVEMENTS, Icon: AssignmentTurnedInIcon },
        { dialogView: STATS, Icon: TrendingUpIcon },
        { dialogView: ACCOUNTING, Icon: AttachMoneyIcon },
      ].map(({ dialogView, Icon }) => (
        <Tooltip
          {...{
            key: dialogView,
            placement: 'bottom',
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
        maxWidth: 'md',
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
  dayCount: number.isRequired,
  handleClickDialogViewButton: func.isRequired,
  handleCloseDialogView: func.isRequired,
  handleDialogViewExited: func.isRequired,
  handleViewChange: func.isRequired,
  inventory: array.isRequired,
  inventoryLimit: number.isRequired,
  itemsSold: object.isRequired,
  isDialogViewOpen: bool.isRequired,
  purchasedCowPen: number.isRequired,
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
