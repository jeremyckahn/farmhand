import { useContext } from 'react'

import { Div } from '../Elements/index.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import ForestPlot from '../ForestPlot/index.js'
import ForestQuickSelect from '../ForestQuickSelect/index.js'

export const Forest = () => {
  const {
    gameState: { forest },
  } = useContext(FarmhandContext)

  const columns = forest[0]?.length ?? 0
  const rows = forest.length

  // A tree sprite pokes up above its own plot (see ForestPlot.tsx's
  // .ForestTreeSprite sx): bottom: 50% plus a 1/2 aspect ratio means it
  // stands 150% of its own plot's height taller than the plot itself. The
  // top row has no plot above it to overhang into, so some space has to be
  // reserved above the whole grid, and the plot size itself has to shrink
  // on shorter viewports so that reserve doesn't push the bottommost real
  // row below the fold. A full 150% reserve is more conservative than
  // needed in practice (most of that height is transparent canvas above
  // the actual canopy pixels) and makes every plot noticeably smaller for
  // a worst case that isn't visually real, so this reserves one row's
  // worth instead - confirmed empirically to still clear the nav bar with
  // room to spare.
  const OVERHANG_ROW_MULTIPLE = 1

  // Matches Field.tsx's obscuringLandscapeUiVerticalOffset: Forest sits in
  // the same app shell (nav bar + fixed QuickSelect toolbelt chrome), so the
  // same fixed vertical budget applies here.
  const CHROME_HEIGHT_PX = 395

  // Cap each column at whichever is smaller: the usual 160px design max, or
  // an equal share of the vertical space left after that chrome and the
  // overhang reserve are subtracted.
  const maxPlotSize = `min(160px, calc((100vh - ${CHROME_HEIGHT_PX}px) / ${rows +
    OVERHANG_ROW_MULTIPLE}))`

  // The reserve itself, in the same unit as a plot. Applying this as
  // one-sided paddingTop on .Forest (below) shifts the flexbox
  // justify-content: center midpoint of its content down by half this
  // amount, regardless of which of .Forest/forest-plots actually holds the
  // padding - it's counteracted by an equal-and-opposite translateY on
  // forest-plots instead (see below).
  const topOverhangReserve = `calc(${OVERHANG_ROW_MULTIPLE} * ${maxPlotSize})`

  return (
    <Div
      {...{ className: 'Forest' }}
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '0 auto',
        paddingTop: topOverhangReserve,
        '@media (orientation: portrait)': {
          marginBottom: '10.5em',
        },
      }}
    >
      <Div
        {...{ className: 'forest-plots' }}
        sx={{
          display: 'grid',
          rowGap: '2%',
          // Must equal a plot's width: the +/-50% row stagger below
          // (ForestPlot.tsx) nets a 1-plot offset between adjacent rows,
          // which only lands a shifted canopy in the gap between two
          // plots above - instead of still fully overlapping one - if the
          // gap is that wide too.
          columnGap: maxPlotSize,
          justifyContent: 'center',
          width: '100%',
          gridTemplateColumns: `repeat(${columns}, minmax(0, ${maxPlotSize}))`,
          // Reserves the same half-plot on each side so the outermost
          // staggered plots don't get clipped by Stage's overflow: auto.
          paddingLeft: `calc(${maxPlotSize} / 2)`,
          paddingRight: `calc(${maxPlotSize} / 2)`,
          // Counteracts a structural bias in the flex centering below: with
          // topOverhangReserve applied as paddingTop on .Forest, the
          // one-sided reserved space shifts the centered content's
          // midpoint down by half that reserve (verified algebraically),
          // regardless of which box actually holds the padding. This
          // transform must live here, not on .Forest - .Forest is an
          // ancestor of the fixed-positioned ForestQuickSelect, and a
          // transform on it would break that fixed positioning.
          transform: `translateY(calc(${topOverhangReserve} / -2))`,
        }}
      >
        {forest.map((row, y) =>
          row.map((plotContent, x) => (
            <ForestPlot key={`${x},${y}`} {...{ plotContent, x, y }} />
          ))
        )}
      </Div>
      <ForestQuickSelect />
    </Div>
  )
}
