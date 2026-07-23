import HotelIcon from '@mui/icons-material/Hotel.js'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft.js'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight.js'
import MenuIcon from '@mui/icons-material/Menu.js'
import CssBaseline from '@mui/material/CssBaseline/index.js'
import Drawer from '@mui/material/Drawer/index.js'
import Fab from '@mui/material/Fab/index.js'
import MobileStepper from '@mui/material/MobileStepper/index.js'
import { Theme, ThemeProvider } from '@mui/material/styles/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import classNames from 'classnames'
import localforage from 'localforage'
import { SnackbarProvider } from 'notistack'
import { object } from 'prop-types'
import { GlobalHotKeys } from 'react-hotkeys'
import { Redirect } from 'react-router-dom'

import { Z_INDEX } from '../../constants.js'
import theme, { blueStripeBg } from '../../mui-theme.js'
import { Div } from '../Elements/index.js'
import { fillSx } from '../../styles/sx.js'
import { breakpoints, layout } from '../../styles/tokens.js'

import 'animate.css/source/_vars.css'
import 'animate.css/source/_base.css'
import 'animate.css/source/attention_seekers/heartBeat.css'

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

const Farmhand = (props: FarmhandProps) => {
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          classes={{ containerRoot: 'Farmhand notification-container' }}
          content={snackbarProviderContentCallback}
          maxSnack={4}
        >
          {redirect && <Redirect to={redirect} />}
          <FarmhandContext.Provider value={{ gameState, handlers }}>
            <Div
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
              sx={(t: Theme) => ({
                ...fillSx,
                // padding-top and breakpoints correspond to AppBar dimensions
                // https://material-ui.com/demos/app-bar/
                display: 'flex',
                paddingTop: '3.5em',
                position: 'fixed',
                touchAction: 'manipulation',
                opacity: state.hasBooted ? 1 : 0,
                transform: state.hasBooted ? 'scale(1)' : 'scale(0)',
                transition: 'opacity, transform 200ms',
                ...(isInputBlocked && {
                  '& button, & input': {
                    filter: 'contrast(65%)',
                    pointerEvents: 'none',
                  },
                }),
                [`@media (min-width: ${breakpoints.smallPhone}px) and (orientation: landscape)`]: {
                  paddingTop: '3em',
                },
                [`@media (min-width: ${breakpoints.sm}px)`]: {
                  paddingTop: '4em',
                },
                '& .sidebar-wrapper': { display: 'flex' },
                '& .bottom-controls': {
                  alignItems: 'center',
                  bottom: '1em',
                  display: 'flex',
                  flexFlow: 'column',
                  justifyContent: 'center',
                  left: '50%',
                  opacity: 0.85,
                  position: 'fixed',
                  transition: t.transitions.create('left', {
                    duration: t.transitions.duration.enteringScreen,
                    easing: t.transitions.easing.easeOut,
                  }),
                  width: 0,
                  zIndex: 20,
                  [`@media (max-width: ${breakpoints.mediumPhone}px)`]: {
                    bottom: '0.5em',
                  },
                  '& .MuiMobileStepper-root': { background: 'none' },
                  '& .fab-buttons': {
                    display: 'flex',
                    flexFlow: 'row',
                    '& button': {
                      margin: '0.5em',
                      position: 'relative',
                      [`@media (max-width: ${breakpoints.mediumPhone}px)`]: {
                        margin: '0.25em 0.5em',
                      },
                      '@media (max-width: 320px)': {
                        margin: '0.25em 0.1em',
                      },
                    },
                  },
                  ...(state.isMenuOpen && {
                    '@media (orientation: landscape)': {
                      left: `calc(50vw + ${layout.sidebarWidth} / 2)`,
                    },
                  }),
                },
                '& .end-day': {
                  position: 'fixed',
                  top: '5em',
                  right: '1em',
                  [`@media (min-width: ${breakpoints.sm}px)`]: {
                    right: '1.25em',
                    top: '5.5em',
                  },
                  ...(state.useAlternateEndDayButtonPosition && {
                    right: 'auto',
                    left: '1em',
                  }),
                },
                '& .menu-button': {
                  transition: t.transitions.create('transform', {
                    duration: t.transitions.duration.shorter,
                  }),
                  transform: state.isMenuOpen
                    ? 'rotate(-90deg)'
                    : 'rotate(0deg)',
                },
              })}
            >
              <UpdateNotifier />
              <AppBar />
              <Drawer
                className="sidebar-wrapper"
                open={gameState.isMenuOpen}
                variant="persistent"
                role="complementary"
                PaperProps={{
                  className: 'sidebar',
                  sx: {
                    backgroundImage: `url(${blueStripeBg})`,
                    boxSizing: 'border-box',
                    overflow: 'auto',
                    padding: '1em 1em 0',
                    position: 'relative',
                    width: layout.sidebarWidth,
                    zIndex: 20,
                    [`@media (max-width: ${breakpoints.smallPhone}px)`]: {
                      width: layout.narrowSidebarWidth,
                    },
                    '& .button-array': {
                      display: 'flex',
                      flexWrap: 'wrap',
                      margin: '0.5em 0',
                    },
                  },
                }}
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
            </Div>
            {isChatAvailable ? <ChatRoom /> : null}
            <NotificationSystem />
          </FarmhandContext.Provider>
        </SnackbarProvider>
      </ThemeProvider>
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

export default Farmhand
