import React from 'react'
import { array, bool, func, object, string } from 'prop-types'
import Button from '@mui/material/Button/index.js'
import Divider from '@mui/material/Divider/index.js'
import Grid from '@mui/material/Grid/index.js'
import Paper from '@mui/material/Paper/index.js'
import Tooltip from '@mui/material/Tooltip/index.js'
import Typography from '@mui/material/Typography/index.js'
import classNames from 'classnames'

import { Theme } from '@mui/material/styles/index.js'

import FarmhandContext from '../Farmhand/Farmhand.context.js'
import { items as itemImages, pixel } from '../../img/index.js'
import { integerString } from '../../utils/integerString.js'
import { sortItems } from '../../utils/sortItems.js'
import Toolbelt from '../Toolbelt/index.js'

import { Div, Img, P } from '../Elements/index.js'
import { cardStyleSx, spriteShadowSx, squareImgSx } from '../../styles/sx.js'
import { breakpoints, layout } from '../../styles/tokens.js'

const ItemList = ({
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
                }`,
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
    sx={(theme: Theme) => ({
      ...cardStyleSx(theme),
      bottom: '7.5em',
      left: '50%',
      maxWidth: 'calc(100% - 2em)',
      position: 'fixed',
      transform: 'translateX(-50%)',
      '@media (orientation: landscape)': {
        bottom: 'auto',
        [`@media (max-height: ${breakpoints.largePhone}px)`]: {
          top: '5em',
          maxWidth: 'calc(100% - 12em)',
          left: `calc(50% - (${layout.fieldSpaceForRightSideControls} / 2))`,
        },
        [`@media (max-width: ${breakpoints.md}px)`]: {
          display: isMenuOpen ? 'none' : undefined,
        },
      },
      [`@media (orientation: landscape) and (min-height: ${breakpoints.largePhone}px)`]: {
        left: 'auto',
        maxHeight: 'calc(100vh - 20em)',
        minWidth: '4em',
        overflow: 'auto',
        right: '0.75em',
        top: '9em',
        transform: 'none',
        bottom: '8em',
      },
      '@media (orientation: portrait)': {
        display: isMenuOpen ? 'none' : undefined,
      },
      '& .MuiGrid-root': {
        borderRadius: '0.25em',
        overflowX: 'scroll',
        overflowY: 'hidden',
        padding: '0.5em',
        position: 'relative',
        [`@media (orientation: landscape) and (min-height: ${breakpoints.largePhone}px)`]: {
          overflowX: 'hidden',
          flexDirection: 'column',
        },
        '& > *': {
          [`@media (orientation: landscape) and (min-height: ${breakpoints.largePhone}px)`]: {
            alignItems: 'center',
            width: '3em',
          },
        },
      },
      '& .Toolbelt': {
        display: 'flex',
        flexFlow: 'column',
        justifyContent: 'center',
      },
      '& .MuiDivider-root': {
        margin: '0 0.5em',
        [`@media (orientation: landscape) and (min-height: ${breakpoints.largePhone}px)`]: {
          margin: '0 0 1em 0',
          height: '1px',
          width: '100%',
        },
      },
    })}
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
