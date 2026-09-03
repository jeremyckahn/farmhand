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

  // Warn only on an actual tab close/reload, not in-app navigation:
  // checkpoints (see handleCheckpoint below) already let the player
  // navigate away via Farmhand's own nav buttons and back with minimal
  // friction, resuming from the last idle checkpoint - a losable-work
  // warning on every such click would fight that, not protect it.
  useEffect(() => {
    if (!farmhandShuffle.isMatchInProgress || matchPhase !== 'playing') {
      return
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [farmhandShuffle.isMatchInProgress, matchPhase])

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
            // The bot opponent is always the same fixed id (BOT_PLAYER_ID) -
            // a generated animal name for it would be out of place inside
            // Farmhand, which has no other concept of naming NPCs. See
            // farmhand-shuffle's MatchProps.useGenericPlayerLabels.
            useGenericPlayerLabels: true,
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
    </Div>
  )
}
