import HotelIcon from '@mui/icons-material/Hotel.js'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft.js'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight.js'
import MenuIcon from '@mui/icons-material/Menu.js'
import Drawer from '@mui/material/Drawer/index.js'
import Fab from '@mui/material/Fab/index.js'
import MobileStepper from '@mui/material/MobileStepper/index.js'
import {
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import classNames from 'classnames'
import localforage from 'localforage'
import { SnackbarProvider } from 'notistack'
import { object } from 'prop-types'
import { GlobalHotKeys } from 'react-hotkeys'
import { Redirect } from 'react-router-dom'

import { Z_INDEX } from '../../constants.js'
import theme from '../../mui-theme.js'

// NOTE: This must be imported here so that it can be overridden by component
// styles. The newlines before and after are intentional to prevent imports
// from being automatically reordered in a way that would break styles.
import './Farmhand.sass'

import AppBar from '../AppBar/index.js'
import { ChatRoom } from '../ChatRoom/index.js'
import ContextPane from '../ContextPane/index.js'
import Navigation from '../Navigation/index.js'
import NotificationSystem, {
  snackbarProviderContentCallback,
} from '../NotificationSystem/index.js'
import Stage from '../Stage/index.js'
import UpdateNotifier from '../UpdateNotifier/index.js'

import FarmhandContext from './Farmhand.context.js'
import { FarmhandProps } from './FarmhandReducers.js'
import { useFarmhand } from './useFarmhand.js'

// Utility object for reuse in no-ops to save on memory
const emptyObject = Object.freeze({})

export type FarmhandInstance = any

export default function Farmhand(props: FarmhandProps) {
  const {
    gameState,
    handlers,
    isInputBlocked,
    keyMap,
    keyHandlers,
    redirect,
    state,
    viewList,
    focusPreviousView,
    focusNextView,
    isChatAvailable,
  } = useFarmhand(props)

  return (
    <GlobalHotKeys
      allowChanges={true}
      keyMap={isInputBlocked ? emptyObject : keyMap}
      handlers={isInputBlocked ? emptyObject : keyHandlers}
    >
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <SnackbarProvider
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            classes={{ containerRoot: 'Farmhand notification-container' }}
            content={snackbarProviderContentCallback}
            maxSnack={4}
          >
            {redirect && <Redirect to={redirect} />}
            <FarmhandContext.Provider value={{ gameState, handlers }}>
              <div
                className={classNames(
                  'Farmhand farmhand-root fill',
                  state.isMenuOpen ? 'menu-open' : 'menu-closed',
                  {
                    'use-alternate-end-day-button-position':
                      state.useAlternateEndDayButtonPosition,
                    'block-input': isInputBlocked,
                    'has-booted': state.hasBooted,
                  }
                )}
              >
                <UpdateNotifier />
                <AppBar />
                <Drawer
                  className="sidebar-wrapper"
                  open={gameState.isMenuOpen}
                  variant="persistent"
                  role="complementary"
                  PaperProps={{ className: 'sidebar' }}
                >
                  <Navigation />
                  <ContextPane />
                  <div className="spacer" />
                </Drawer>
                <Stage />
                <div className="bottom-controls">
                  <MobileStepper
                    variant="dots"
                    steps={viewList.length}
                    position="static"
                    activeStep={viewList.indexOf(state.stageFocus)}
                    className=""
                    backButton={null}
                    nextButton={null}
                  />
                  <div className="fab-buttons buttons">
                    <Fab
                      aria-label="Previous view"
                      color="primary"
                      onClick={focusPreviousView}
                    >
                      <KeyboardArrowLeft />
                    </Fab>
                    <Fab
                      className={classNames('menu-button', {
                        'is-open': state.isMenuOpen,
                      })}
                      color="primary"
                      aria-label="Open drawer"
                      onClick={() => handlers.handleMenuToggle()}
                    >
                      <MenuIcon />
                    </Fab>
                    <Fab
                      aria-label="Next view"
                      color="primary"
                      onClick={focusNextView}
                    >
                      <KeyboardArrowRight />
                    </Fab>
                  </div>
                </div>
                <Tooltip
                  placement="left"
                  title={
                    <>
                      <p>
                        End the day to save your progress and advance the game.
                      </p>
                      <p>(shift + c)</p>
                    </>
                  }
                >
                  <Fab
                    aria-label="End the day to save your progress and advance the game."
                    className="end-day"
                    color="error"
                    onClick={handlers.handleClickEndDayButton}
                    sx={{ zIndex: Z_INDEX.END_DAY_BUTTON }}
                  >
                    <HotelIcon />
                  </Fab>
                </Tooltip>
              </div>
              {isChatAvailable ? <ChatRoom /> : null}
              <NotificationSystem />
            </FarmhandContext.Provider>
          </SnackbarProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </GlobalHotKeys>
  )
}

Farmhand.defaultProps = {
  localforage: localforage.createInstance({
    name: 'farmhand',
    description: 'Persisted game data for Farmhand',
  }),
  features: {},
  match: { path: '', params: {} },
}

Farmhand.propTypes = {
  features: object,
  history: object,
  location: object,
  match: object.isRequired,
}
