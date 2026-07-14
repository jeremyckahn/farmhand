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

  // The reserve itself, in the same unit as a plot - kept on the Forest
  // wrapper (not on forest-plots) so it isn't part of what .Forest's own
  // flexbox justify-content: center treats as content to center. Otherwise
  // this reserve - which is invisible, decorative space, not real content -
  // would get centered right along with the actual rows, visually pushing
  // them below true center by half the reserve's height.
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
          gap: '2%',
          justifyContent: 'center',
          width: '100%',
          gridTemplateColumns: `repeat(${columns}, minmax(0, ${maxPlotSize}))`,
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
