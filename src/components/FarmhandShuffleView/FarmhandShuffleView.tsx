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
  bottomInsetVar,
  contentPaddingVar,
  deserializeMatch,
  handToggleBottomVar,
  handToggleLeftVar,
  placeholderOutlineColorVar,
  serializeMatch,
  starterDeck,
} from '@jeremyckahn/farmhand-shuffle'
import farmhandShufflePackageJson from '@jeremyckahn/farmhand-shuffle/package.json'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { FARMHAND_SHUFFLE_BOT_PLAYER_ID } from '../../constants.js'
import { breakpoints } from '../../styles/tokens.js'
import { Div, H2, P } from '../Elements/index.js'
import { Markdown } from '../Markdown/index.js'
import { moneyString } from '../../utils/moneyString.js'

// The installed @jeremyckahn/farmhand-shuffle version, used to tag every
// checkpoint we write. Compared against on resume so a later library update
// that changes IMatch's internal shape can be detected and handled gracefully
// (refund + notify) instead of crashing.
const FARMHAND_SHUFFLE_LIBRARY_VERSION = farmhandShufflePackageJson.version

// v1 uses one fixed, symmetric starter deck for both sides.
const BOT_PLAYER_ID = FARMHAND_SHUFFLE_BOT_PLAYER_ID

const CHECKPOINT_STATES = [
  MatchState.WAITING_FOR_PLAYER_SETUP_ACTION,
  MatchState.WAITING_FOR_PLAYER_TURN_ACTION,
] as const

type CheckpointMatchState = (typeof CHECKPOINT_STATES)[number]

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
  // render it as "no wager placed" instead .
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
    // Only needed when a Match mounts (it ignores initialMatch afterwards), so
    // don't redo this - a full deserialization - on every checkpoint save.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchPhase])

  useEffect(() => {
    if (initialMatch === 'error') {
      handlers.handleRefundUnresumableFarmhandShuffleMatch()
      setMatchPhase('wager')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialMatch])

  const handleSubmitWager = () => {
    handlers.handlePlaceFarmhandShuffleWager(wagerInputValue)
    setMatchPhase('playing')
  }

  // Set just before handleMatchEnd's own call to
  // handleSettleFarmhandShuffleMatch, so the effect below can tell "Match's
  // own onMatchEnd just cleared isMatchInProgress" (its GAME_OVER dialog is
  // showing - stay put) apart from "isMatchInProgress was cleared by
  // something else" (e.g. FarmhandShuffleContextMenu's Forfeit button,
  // which settles the match directly since it isn't a descendant of this
  // component and has no dialog of its own to route through - snap back to
  // the wager screen instead).
  const settledViaMatchEndRef = useRef(false)

  const handleMatchEnd = (winnerId: string | null) => {
    settledViaMatchEndRef.current = true
    handlers.handleSettleFarmhandShuffleMatch(winnerId, userPlayerId)
  }

  useEffect(() => {
    if (farmhandShuffle.isMatchInProgress || matchPhase !== 'playing') {
      return
    }

    if (settledViaMatchEndRef.current) {
      settledViaMatchEndRef.current = false
      return
    }

    setMatchPhase('wager')
    setWagerInputValue(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farmhandShuffle.isMatchInProgress])

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
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // The Stage doesn't scroll for this view (Match scrolls itself), so
        // the wager screen - now taller than a phone screen with the intro
        // text - scrolls here instead, with the scrollbar hidden like
        // Match's. The bottom padding keeps the last card clear of
        // Farmhand's fixed bottom nav buttons.
        ...(matchPhase === 'wager' && {
          overflowX: 'hidden',
          overflowY: 'auto',
          // The Stage has no padding for this view (see Stage.tsx), so the
          // wager screen keeps the 0.5rem inset around it itself.
          padding: '0.5rem 0.5rem 8em',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }),
      }}
    >
      {matchPhase === 'wager' && (
        // Like the view title Stage shows above the other views' panels (the
        // Cellar's, for one) on narrow screens, where the AppBar has no room
        // for it. Stage hides that one for this view, since the match itself
        // needs the space, so it's rendered here for the wager screen only.
        <H2
          sx={{
            // `&&` so this beats Stage's own `& h2` font size.
            '&&': {
              fontSize: '2.5em',
              marginBottom: '0.6em',
              textAlign: 'center',
              // Farmhand's fixed End Day button (`.end-day` in Farmhand.tsx)
              // sits at the top right of the Stage and would cover the
              // content, so it starts below the button, with the same gap
              // under the button as there is above it (between the AppBar
              // and the button). Measured in the browser: 4.75rem below `sm`
              // (56px AppBar, button at 70-126px) and 4.625rem from `sm` up
              // (64px AppBar, button at 77-133px), net of the Stage's own
              // 0.5rem top padding (see Stage.tsx).
              // rem, not em: em would resolve against this heading's own
              // 2.5em font size.
              marginTop: '4.75rem',
              flexShrink: 0,
              [`@media (min-width: ${breakpoints.largePhone}px)`]: {
                display: 'none',
              },
            },
          }}
        >
          Farmhand Shuffle
        </H2>
      )}
      {matchPhase === 'wager' && (
        // A translucent panel (like the Cellar and Workshop tab panels)
        // holding the wager card and, below it, a card of flavor text.
        <Div
          sx={{
            maxWidth: '30em',
            // 1em narrower than the space available on each side, which with
            // the Stage's own 0.5rem inset puts the panel 1.5em from the
            // screen's edges, like the Cellar and Workshop panels.
            width: 'calc(100% - 2em)',
            // Don't let the flex column squash the panel when the page is
            // taller than the screen.
            flexShrink: 0,
            // On wide screens (where the AppBar already shows the title, so
            // the one above is hidden) the panel itself starts below
            // Farmhand's fixed End Day button; see the title's own margin
            // for how that offset is derived.
            margin: '0 auto 2em',
            [`@media (min-width: ${breakpoints.largePhone}px)`]: {
              marginTop: '4.75em',
            },
            [`@media (min-width: ${breakpoints.sm}px)`]: {
              marginTop: '4.625em',
            },
            padding: '0.5em',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '0.5em',
            '& > * + *': { marginTop: '1em' },
            // card-list adds its own bottom margin (and its last item
            // another) - drop it so the panel's padding is even all around.
            '& .card-list': { marginBottom: 0 },
            '& .card-list > li:last-child': { marginBottom: 0 },
          }}
        >
          <Card>
            <CardHeader
              {...{
                subheader:
                  'Wager money on a match. Winning gets you double your money back!',
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
          <ul className="card-list">
            <li>
              <Card>
                <CardContent>
                  <Markdown
                    {...{
                      children: `Farmhand Shuffle is a card game for farmers! Just like the Field, the goal is to plant, water, and harvest crops for a profit. Some crop values rise and fall depending on the turn, so try to time your harvest to make the most of it.

In Farmhand Shuffle you play against a bot opponent and pay money into a Community Fund at the start of every turn. Whoever avoids bankruptcy the longest wins!`,
                    }}
                  />
                </CardContent>
              </Card>
            </li>
          </ul>
        </Div>
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
            // Match scrolls its own content when the Stage is shorter than
            // the table (see farmhand-shuffle's MatchProps.hideScrollbar).
            // A classic scrollbar there sits on top of the right edge of
            // the game's UI, so it's hidden - wheel, touch, and keyboard
            // scrolling still work.
            hideScrollbar: true,
            // Not fullHeight (100vh): FarmhandShuffleView's own root div
            // already fills the exact space Stage makes available (see
            // its sx above), which is shorter than the full viewport
            // (the AppBar and Stage's own layout already consume some of
            // it) - 100vh would overflow that and force Stage itself to
            // scroll too. height: '100%' fills the real available space
            // instead, and Match's own inner scroll container is what
            // actually scrolls.
            //
            // The background overrides replace Match's own default
            // treatment (a solid color plus a repeating dot pattern) with
            // nothing, letting Stage's own Farmhand Shuffle background
            // (see Stage.tsx) show through instead - consistent with
            // every other stage's own background export. Match's default
            // text color (white, meant to read against its own orange
            // background) is overridden the same way now that Stage's
            // own lighter background is showing through instead. The empty
            // Field plot and discard pile placeholder outlines are darkened
            // for the same reason - Match's default is too faint to stand
            // out against Stage's background.
            sx: {
              height: '100%',
              backgroundColor: 'transparent',
              backgroundImage: 'none',
              color: 'black',
              [placeholderOutlineColorVar]: 'rgba(0, 0, 0, 0.35)',
              // The spacing between the game and the edges of the Stage.
              // Shuffle draws its glows and hover effects into this space
              // and fades them out at the Stage's edge (see Match.tsx).
              [contentPaddingVar]: '0.5rem',
              // On narrow screens Farmhand's fixed nav buttons sit over the
              // bottom of the game, on top of the Hand. Reserve the same
              // 7.5em the other views leave under their content (the
              // `.spacer` in mui-theme.ts) so Shuffle keeps the Hand above
              // the buttons and can scroll clear of them. `max-width` of
              // 899.95px is Shuffle's own narrow-viewport cutoff (MUI's
              // `md`, 900px, with `down` being exclusive).
              [bottomInsetVar]: '0px',
              '@media (max-width: 899.95px)': {
                [bottomInsetVar]: '7.5em',
              },
              // Lines the hide/show Hand button up with Farmhand's own
              // bottom nav buttons (`.bottom-controls` in Farmhand.tsx):
              // their bottom edge sits 1.4375rem (measured in the browser)
              // above the screen's bottom, so the button matches that, and
              // is the same distance from the Stage's left edge (Match
              // fills the Stage, so no inset comes off it). Only applies on
              // large viewports; narrow ones don't render this button.
              [handToggleBottomVar]: '1.4375rem',
              [handToggleLeftVar]: '1.4375rem',
            },
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
