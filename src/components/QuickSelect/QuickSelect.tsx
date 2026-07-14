import Divider from '@mui/material/Divider/index.js'
import Grid from '@mui/material/Grid/index.js'
import Paper from '@mui/material/Paper/index.js'
import { Theme } from '@mui/material/styles/index.js'
import { array, bool, func, object, string } from 'prop-types'

import { quickSelectSx } from '../../styles/sx.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { ItemList } from '../ItemList/index.js'
import Toolbelt from '../Toolbelt/index.js'

const QuickSelect = ({
  fieldToolInventory,
  handleItemSelectClick,
  isMenuOpen = true,
  playerInventoryQuantities,
  plantableCropInventory,
  selectedItemId,
}: {
  fieldToolInventory: farmhand.item[]
  handleItemSelectClick: (item: farmhand.item) => void
  isMenuOpen?: boolean
  playerInventoryQuantities: Record<string, number>
  plantableCropInventory: farmhand.item[]
  selectedItemId: string
}) => (
  <Paper
    {...{ className: 'QuickSelect', elevation: 10 }}
    sx={(theme: Theme) => quickSelectSx(theme, isMenuOpen)}
  >
    <Grid {...{ container: true, alignItems: 'center', wrap: 'nowrap' }}>
      <Toolbelt />
      {plantableCropInventory.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem />
          <ItemList
            {...{
              handleItemSelectClick,
              items: plantableCropInventory,
              playerInventoryQuantities,
              selectedItemId,
            }}
          />
        </>
      )}

      {fieldToolInventory.length > 0 && (
        <>
          <Divider orientation="vertical" flexItem />
          <ItemList
            {...{
              handleItemSelectClick,
              items: fieldToolInventory,
              playerInventoryQuantities,
              selectedItemId,
            }}
          />
        </>
      )}
    </Grid>
  </Paper>
)

QuickSelect.propTypes = {
  fieldToolInventory: array.isRequired,
  handleItemSelectClick: func,
  isMenuOpen: bool,
  plantableCropInventory: array.isRequired,
  playerInventoryQuantities: object.isRequired,
  selectedItemId: string.isRequired,
}

export default function Consumer(
  props: Partial<Parameters<typeof QuickSelect>[0]>
) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <QuickSelect
          {...({
            ...gameState,
            ...handlers,
            ...props,
          } as Parameters<typeof QuickSelect>[0])}
        />
      )}
    </FarmhandContext.Consumer>
  )
}
