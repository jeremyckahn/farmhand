import React, {
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import Button from '@mui/material/Button/index.js'
import Card from '@mui/material/Card/index.js'
import CardContent from '@mui/material/CardContent/index.js'
import CardHeader from '@mui/material/CardHeader/index.js'
import Dialog from '@mui/material/Dialog/index.js'
import DialogActions from '@mui/material/DialogActions/index.js'
import DialogContent from '@mui/material/DialogContent/index.js'
import DialogTitle from '@mui/material/DialogTitle/index.js'
import TextField from '@mui/material/TextField/index.js'
import NumberFormat from 'react-number-format'
import {
  Match,
  MatchState,
  deserializeMatch,
  serializeMatch,
  starterDeck,
} from '@jeremyckahn/farmhand-shuffle'
import farmhandShufflePackageJson from '@jeremyckahn/farmhand-shuffle/package.json'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { Div, P } from '../Elements/index.js'
import { moneyString } from '../../utils/moneyString.js'

// The installed @jeremyckahn/farmhand-shuffle version, used to tag every
// checkpoint we write. Compared against on resume so a later library update
// that changes IMatch's internal shape can be detected and handled gracefully
// (refund + notify) instead of crashing - see the integration plan's Edge
// cases section.
const FARMHAND_SHUFFLE_LIBRARY_VERSION = farmhandShufflePackageJson.version

// v1 uses one fixed, symmetric starter deck for both sides (see the
// integration plan's locked-in "Deck" decision) and a stable id for the
// (only) bot opponent.
const BOT_PLAYER_ID = 'farmhand-shuffle-bot'

const CHECKPOINT_STATES = [
  MatchState.WAITING_FOR_PLAYER_SETUP_ACTION,
  MatchState.WAITING_FOR_PLAYER_TURN_ACTION,
] as const

type CheckpointMatchState = typeof CHECKPOINT_STATES[number]

interface WagerNumberFormatProps {
  max: number
  onChange: (v: number) => void
  [key: string]: unknown
}

// Mirrors AccountingView.tsx's MoneyNumberFormat (the loan-paydown field)
// so every money input in the app looks and behaves the same way.
//
// forwardRef<T, any> at the outer boundary, with the concrete prop shape
// destructured inside the function body instead of the parameter list: a
// prop type combining named properties with an index-signature intersection
// loses its specific property types when TypeScript computes
// Omit<P, 'ref'> for forwardRef under React 18's @types/react.
const WagerNumberFormat = forwardRef<HTMLInputElement, any>(
  (props: any, ref) => {
    const { max, onChange, ...rest }: WagerNumberFormatProps = props

    return (
      <NumberFormat
        fixedDecimalScale
        thousandSeparator
        getInputRef={ref}
        {...{
          ...rest,
          allowNegative: false,
          decimalScale: 2,
          prefix: '$',
          isAllowed: ({ floatValue = 0 }) => floatValue <= max,
          onValueChange: ({ floatValue = 0 }) => onChange(floatValue),
        }}
      />
    )
  }
)

const WagerStatusBadge = ({ wager }: { wager: number }) => (
  <P
    sx={{
      textAlign: 'center',
      fontWeight: 'bold',
      margin: '0.5em 0',
    }}
  >
    {wager > 0
      ? `Wager: ${moneyString(wager)} · win pays ${moneyString(wager * 2)}`
      : 'No wager placed · playing for fun'}
  </P>
)

interface ShuffleResultSummaryProps {
  winnerId: string | null
  userPlayerId: string
  wager: number
  winStreak: number
  onPlayAgain: () => void
  onLeave: () => void
}

const ShuffleResultSummary = ({
  winnerId,
  userPlayerId,
  wager,
  winStreak,
  onPlayAgain,
  onLeave,
}: ShuffleResultSummaryProps) => {
  const isDraw = winnerId === null
  const isWin = !isDraw && winnerId === userPlayerId

  // A $0 wager is valid and plays out normally, but "+$0" reads like a bug -
  // render it as "no wager placed" instead (see the plan's Edge cases).
  const resultLine =
    wager === 0
      ? 'No wager was placed.'
      : isDraw
      ? `It's a draw — your ${moneyString(wager)} wager was refunded.`
      : isWin
      ? `You won ${moneyString(wager * 2)}!`
      : `You lost your ${moneyString(wager)} wager.`

  return (
    <Div sx={{ marginTop: '1em', textAlign: 'center' }}>
      <P sx={{ fontWeight: 'bold' }}>{resultLine}</P>
      {isWin && winStreak > 1 && <P>Current win streak: {winStreak}</P>}
      <Div sx={{ marginTop: '1em' }}>
        <Button
          {...{
            color: 'primary',
            variant: 'contained',
            onClick: onPlayAgain,
            sx: { marginRight: '1em' },
          }}
        >
          Play again
        </Button>
        <Button {...{ color: 'inherit', onClick: onLeave }}>Leave</Button>
      </Div>
    </Div>
  )
}

export const FarmhandShuffleView = () => {
  const {
    gameState: { farmhandShuffle, money, playerId },
    handlers,
  } = useContext(FarmhandContext)

  const userPlayerId = playerId

  const [matchPhase, setMatchPhase] = useState<'wager' | 'playing'>(
    farmhandShuffle.isMatchInProgress ? 'playing' : 'wager'
  )
  const [wagerInputValue, setWagerInputValue] = useState(0)

  const containerRef = useRef<HTMLDivElement | null>(null)

  // The element the user clicked outside the match while it was still in
  // progress, captured so its click can be re-dispatched (see
  // bypassNextClickRef below) if they confirm they want to leave.
  const [
    pendingLeaveTarget,
    setPendingLeaveTarget,
  ] = useState<HTMLElement | null>(null)

  // Set immediately before programmatically re-clicking pendingLeaveTarget,
  // so handleClickCapture recognizes that replayed click as already-
  // confirmed and lets it through instead of intercepting it again.
  const bypassNextClickRef = useRef(false)

  // The wager is cleared from farmhand.state as soon as the match settles
  // (settleFarmhandShuffleMatch.ts), but the result screen still needs to
  // show what was actually at stake - so capture it locally while the match
  // is in progress, then keep using this captured value once it's cleared.
  const activeWagerRef = useRef(farmhandShuffle.wager)

  if (farmhandShuffle.isMatchInProgress) {
    activeWagerRef.current = farmhandShuffle.wager
  }

  // A fresh, symmetric starter deck for both sides, minted once per mount.
  // Unused when resuming a match (RESUME ignores playerSeeds), but MatchProps
  // requires it regardless.
  const playerSeeds = useMemo(
    () => [
      { id: userPlayerId, deck: starterDeck() },
      { id: BOT_PLAYER_ID, deck: starterDeck() },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userPlayerId]
  )

  const initialMatch = useMemo(():
    | { matchState: CheckpointMatchState; match: any; botState: any }
    | 'error'
    | undefined => {
    const { serializedMatch } = farmhandShuffle

    if (!serializedMatch) {
      return undefined
    }

    if (serializedMatch.libraryVersion !== FARMHAND_SHUFFLE_LIBRARY_VERSION) {
      return 'error'
    }

    try {
      return {
        matchState: serializedMatch.matchState as CheckpointMatchState,
        match: deserializeMatch(serializedMatch.match),
        botState: serializedMatch.botState,
      }
    } catch (e) {
      return 'error'
    }
  }, [farmhandShuffle])

  useEffect(() => {
    if (initialMatch === 'error') {
      handlers.handleRefundUnresumableFarmhandShuffleMatch()
      setMatchPhase('wager')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMatch])

  // Confirm before letting a Stage change (or other outside navigation)
  // happen while a match is genuinely in progress, since checkpoints are
  // deliberately restricted to the two idle states and anything since the
  // last one would otherwise be silently lost (see the plan's Edge cases).
  useEffect(() => {
    if (!farmhandShuffle.isMatchInProgress || matchPhase !== 'playing') {
      return
    }

    const handleClickCapture = (e: MouseEvent) => {
      if (bypassNextClickRef.current) {
        bypassNextClickRef.current = false
        return
      }

      if (
        containerRef.current &&
        e.target instanceof Node &&
        containerRef.current.contains(e.target)
      ) {
        return
      }

      // Farmhand's own persistent chrome - the sidebar drawer and its
      // toggle button, and the top bar's dialog-opening buttons (log,
      // price events, stats, achievements, bank, settings) - doesn't
      // navigate away from this stage at all; it opens an overlay on top
      // of it. Confirming "leave your match?" for these is a false
      // positive that made them appear broken (every click here got
      // silently swallowed by a declined confirm).
      //
      // .MuiModal-root covers every MUI Dialog/Modal in the app, not just
      // this component's own leave-confirmation Dialog below - without
      // it, that Dialog's own Cancel/Leave buttons (rendered outside
      // containerRef, via a portal) would re-trigger this same guard on
      // click, along with the interior content of any of Farmhand's other
      // top-bar dialogs (achievements, stats, etc.) opened while a match
      // is in progress. None of these navigate away from this stage
      // either - they're overlays on top of it, same as the drawer.
      if (
        e.target instanceof Element &&
        e.target.closest(
          '.sidebar-wrapper, [aria-label="Open drawer"], .AppBar, .MuiModal-root'
        )
      ) {
        return
      }

      // Not window.confirm(): a blocking native dialog triggered from a
      // capture-phase document listener is silently suppressed in some
      // browser/embedding contexts (observed here - it returns falsy
      // immediately without ever presenting anything to the user),
      // permanently blocking Previous/Next view navigation with no
      // visible cause. A Dialog this component fully controls doesn't
      // depend on the host allowing native dialogs at all.
      if (e.target instanceof Element) {
        // Click targets an icon (e.g. an <svg>/<path> inside a Fab) more
        // often than the button itself, and SVG elements aren't
        // HTMLElements - re-clicking one directly on confirm wouldn't
        // reliably re-trigger the button's own handler. Resolving to the
        // nearest actual interactive ancestor makes the later replay
        // click() land on an element that's guaranteed to have one.
        const interactiveTarget = (e.target.closest(
          'button, a, [role="button"]'
        ) ?? e.target) as HTMLElement

        e.preventDefault()
        e.stopImmediatePropagation()
        setPendingLeaveTarget(interactiveTarget)
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    document.addEventListener('click', handleClickCapture, true)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('click', handleClickCapture, true)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [farmhandShuffle.isMatchInProgress, matchPhase])

  const handleConfirmLeaveMatch = () => {
    const target = pendingLeaveTarget

    setPendingLeaveTarget(null)

    if (target) {
      bypassNextClickRef.current = true
      target.click()
    }
  }

  const handleCancelLeaveMatch = () => {
    setPendingLeaveTarget(null)
  }

  const handleSubmitWager = () => {
    handlers.handlePlaceFarmhandShuffleWager(wagerInputValue)
    setMatchPhase('playing')
  }

  const handleMatchEnd = (winnerId: string | null) => {
    handlers.handleSettleFarmhandShuffleMatch(winnerId, userPlayerId)
  }

  const handleCheckpoint = ({
    matchState,
    match,
    botState,
  }: {
    matchState: CheckpointMatchState
    match: any
    botState: any
  }) => {
    handlers.handleSaveFarmhandShuffleMatch({
      libraryVersion: FARMHAND_SHUFFLE_LIBRARY_VERSION,
      matchState,
      match: serializeMatch(match),
      botState,
      userPlayerId,
      opponentPlayerId: BOT_PLAYER_ID,
    })
  }

  const handlePlayAgain = () => {
    setWagerInputValue(activeWagerRef.current)
    setMatchPhase('wager')
  }

  const handleLeave = () => {
    setWagerInputValue(0)
    setMatchPhase('wager')
  }

  return (
    <Div
      className="FarmhandShuffleView"
      ref={containerRef}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {matchPhase === 'wager' && (
        <Card sx={{ maxWidth: '30em', margin: '2em auto' }}>
          <CardHeader
            {...{
              title: 'Farmhand Shuffle',
              subheader: 'Wager money on a match against a bot opponent.',
            }}
          />
          <CardContent>
            <P>You have {moneyString(money)}.</P>
            <TextField
              {...{
                variant: 'standard',
                label: 'Wager',
                value: wagerInputValue,
                inputProps: {
                  max: money,
                  min: 0,
                  pattern: '[0-9]*',
                },
                onChange: value => {
                  setWagerInputValue(Number(value))
                },
                InputProps: {
                  inputComponent: WagerNumberFormat,
                },
              }}
            />
            <Div sx={{ marginTop: '1em' }}>
              <Button
                {...{
                  color: 'primary',
                  variant: 'contained',
                  disabled: wagerInputValue < 0 || wagerInputValue > money,
                  onClick: handleSubmitWager,
                }}
              >
                Start Match
              </Button>
            </Div>
          </CardContent>
        </Card>
      )}
      {matchPhase === 'playing' && initialMatch !== 'error' && (
        <Match
          {...{
            playerSeeds,
            userPlayerId,
            initialMatch,
            onMatchEnd: handleMatchEnd,
            onCheckpoint: handleCheckpoint,
            hideDefaultGameOverActions: true,
            // Not fullHeight (100vh): FarmhandShuffleView's own root div
            // already fills the exact space Stage makes available (see
            // its sx above), which is shorter than the full viewport
            // (the AppBar and Stage's own layout already consume some of
            // it) - 100vh would overflow that and force Stage itself to
            // scroll too. height: '100%' fills the real available space
            // instead, and Match's own overflow: auto (untouched by this
            // override) is what actually scrolls.
            //
            // The background overrides replace Match's own default
            // treatment (a solid color plus a repeating dot pattern) with
            // nothing, letting Stage's own Farmhand Shuffle background
            // (see Stage.tsx) show through instead - consistent with
            // every other stage's own background export. Match's default
            // text color (white, meant to read against its own orange
            // background) is overridden the same way now that Stage's
            // own lighter background is showing through instead.
            sx: {
              height: '100%',
              backgroundColor: 'transparent',
              backgroundImage: 'none',
              color: 'black',
            },
            renderStatusBarContent: () => (
              <WagerStatusBadge wager={farmhandShuffle.wager} />
            ),
            renderGameOverContent: (winnerId: string | null) => (
              <ShuffleResultSummary
                {...{
                  winnerId,
                  userPlayerId,
                  wager: activeWagerRef.current,
                  winStreak: farmhandShuffle.currentWinStreak,
                  onPlayAgain: handlePlayAgain,
                  onLeave: handleLeave,
                }}
              />
            ),
          }}
        />
      )}
      <Dialog
        open={pendingLeaveTarget !== null}
        onClose={handleCancelLeaveMatch}
      >
        <DialogTitle>Leave your Farmhand Shuffle match?</DialogTitle>
        <DialogContent>
          Progress since your last completed turn will be lost.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLeaveMatch}>Cancel</Button>
          <Button onClick={handleConfirmLeaveMatch} color="warning">
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </Div>
  )
}
