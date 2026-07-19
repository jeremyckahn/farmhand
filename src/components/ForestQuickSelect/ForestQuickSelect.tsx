import Divider from '@mui/material/Divider/index.js'
import Grid from '@mui/material/Grid/index.js'
import Paper from '@mui/material/Paper/index.js'
import { Theme } from '@mui/material/styles/index.js'
import { array, bool, func, object, string } from 'prop-types'

import { quickSelectSx } from '../../styles/sx.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { ItemList } from '../ItemList/index.js'
import Toolbelt from '../Toolbelt/index.js'

const ForestQuickSelect = ({
  mulchInventory,
  handleForestItemSelectClick,
  handleItemSelectClick,
  isMenuOpen = true,
  playerInventoryQuantities,
  plantableTreeInventory,
  selectedForestItemId,
  selectedItemId,
}: {
  mulchInventory: farmhand.item[]
  handleForestItemSelectClick: (item: farmhand.item) => void
  handleItemSelectClick: (item: farmhand.item) => void
  isMenuOpen?: boolean
  playerInventoryQuantities: Record<string, number>
  plantableTreeInventory: farmhand.item[]
  selectedForestItemId: string
  selectedItemId: string
}) => (
  <Paper
    {...{ className: 'QuickSelect', elevation: 10 }}
    sx={(theme: Theme) => quickSelectSx(theme, isMenuOpen)}
  >
    <Grid {...{ container: true, alignItems: 'center', wrap: 'nowrap' }}>
      <Toolbelt />
      {plantableTreeInventory.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem />
          <ItemList
            {...{
              handleItemSelectClick: handleForestItemSelectClick,
              items: plantableTreeInventory,
              playerInventoryQuantities,
              selectedItemId: selectedForestItemId,
            }}
          />
        </>
      )}
      {mulchInventory.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem />
          <ItemList
            {...{
              handleItemSelectClick,
              items: mulchInventory,
              playerInventoryQuantities,
              selectedItemId,
            }}
          />
        </>
      )}
    </Grid>
  </Paper>
)

ForestQuickSelect.propTypes = {
  mulchInventory: array.isRequired,
  handleForestItemSelectClick: func,
  handleItemSelectClick: func,
  isMenuOpen: bool,
  plantableTreeInventory: array.isRequired,
  playerInventoryQuantities: object.isRequired,
  selectedForestItemId: string.isRequired,
  selectedItemId: string.isRequired,
}

export default function Consumer(
  props: Partial<Parameters<typeof ForestQuickSelect>[0]>
) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <ForestQuickSelect
          {...({
            ...gameState,
            ...handlers,
            ...props,
          } as Parameters<typeof ForestQuickSelect>[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
