import Button from '@mui/material/Button/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import classNames from 'classnames'
import { array, func, object, string } from 'prop-types'

import { items as itemImages, pixel } from '../../img/index.js'
import { spriteShadowSx, squareImgSx } from '../../styles/sx.js'
import { breakpoints } from '../../styles/tokens.js'
import { integerString } from '../../utils/integerString.js'
import { sortItems } from '../../utils/sortItems.js'
import { Div, Img, P } from '../Elements/index.js'

export const ItemList = ({
  handleItemSelectClick,
  items,
  playerInventoryQuantities,
  selectedItemId,
}: {
  handleItemSelectClick: (item: farmhand.item) => void
  items: farmhand.item[]
  playerInventoryQuantities: Record<string, number>
  selectedItemId: string
}) => (
  <Div
    {...{ className: 'button-array' }}
    sx={{
      display: 'flex',
      flexFlow: 'row',
      [`@media (orientation: landscape) and (min-height: ${breakpoints.largePhone}px)`]: {
        flexFlow: 'column',
      },
    }}
  >
    {sortItems(items).map((item: farmhand.item) => (
      <Tooltip
        followCursor
        {...{
          key: item.id,
          placement: 'top',
          title: <Typography>{item.name}</Typography>,
        }}
      >
        <Button
          {...{
            className: classNames({
              'is-selected': item.id === selectedItemId,
            }),
            color: 'primary',
            onClick: () => handleItemSelectClick(item),
            variant: item.id === selectedItemId ? 'contained' : 'text',
          }}
          sx={{
            padding: '0.5em',
            minWidth: '3.5em',
            margin: '0 0.25em',
            '&.MuiButton-containedPrimary': {
              backgroundColor: '#ffb913',
              '&:hover': { backgroundColor: '#e5a000' },
            },
            '&.MuiButton-textPrimary:hover': {
              backgroundColor: '#fff7e4',
            },
          }}
        >
          <Img
            alt={item.name}
            {...{
              className: 'square',
              src: pixel,
              style: {
                backgroundImage: `url(${
                  itemImages[item.id as keyof typeof itemImages]
                })`,
              },
            }}
            sx={{ ...squareImgSx, ...spriteShadowSx }}
          />
          <P
            {...{ className: 'quantity' }}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '1em',
              color: '#fff',
              fontSize: '0.75em',
              lineHeight: 'calc(0.75em - 1px)',
              minWidth: '0.5em',
              padding: '0.5em',
              position: 'absolute',
              right: '-2px',
              top: '-2px',
            }}
          >
            {integerString(playerInventoryQuantities[item.id])}
          </P>
        </Button>
      </Tooltip>
    ))}
  </Div>
)

ItemList.propTypes = {
  handleItemSelectClick: func,
  items: array.isRequired,
  playerInventoryQuantities: object.isRequired,
  selectedItemId: string.isRequired,
}
