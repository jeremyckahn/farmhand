import { Theme } from '@mui/material/styles/index.js'
import { array, bool, func, string } from 'prop-types'
import { useEffect } from 'react'

import { fillSx } from '../../styles/sx.js'
import { colors } from '../../styles/tokens.js'
import { Div } from '../Elements/index.js'
import FarmhandContext from '../Farmhand/Farmhand.context.js'

import { Cow } from './Cow.js'
import { Tumbleweeds } from './Tumbleweeds.js'

export interface CowPenProps
  extends Pick<
    farmhand.state,
    'allowCustomPeerCowNames' | 'cowInventory' | 'playerId' | 'selectedCowId'
  > {
  handleCowPenUnmount: () => void
  handleCowClick: (cow: farmhand.cow) => void
}

export const CowPen = ({
  allowCustomPeerCowNames,
  cowInventory,
  handleCowPenUnmount,
  handleCowClick,
  playerId,
  selectedCowId,
}: CowPenProps) => {
  useEffect(() => {
    return () => {
      handleCowPenUnmount()
    }
  }, [handleCowPenUnmount])

  return (
    <Div
      className="CowPen fill"
      sx={(theme: Theme) => ({
        ...fillSx,
        overflow: 'hidden',
        '& .cow': {
          opacity: 0,
          position: 'absolute',
          zIndex: 20,
          transition: theme.transitions.create('opacity', {
            duration: theme.transitions.duration.enteringScreen,
            easing: theme.transitions.easing.easeOut,
          }),
          '&:hover': { cursor: 'pointer' },
          '&::before': {
            background: 'hsla(0, 0%, 30%, 0.5)',
            borderRadius: '50%',
            bottom: '5px',
            content: '""',
            height: '16px',
            left: '16px',
            position: 'absolute',
            width: '75px',
            zIndex: -1,
          },
          '&.is-loaded': { opacity: 1 },
          '&.is-selected': {
            // Render the selected cow on top of all others
            zIndex: 40,
            '& img': { filter: 'drop-shadow(0 0 5px #fff)' },
          },
          '& img': {
            width: '100px',
            transition: theme.transitions.create('filter', {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.easeOut,
            }),
          },
          '& .fa-heart': {
            color: colors.heart,
            '&.animation': {
              opacity: 0,
              position: 'absolute',
              right: '20px',
              top: '10px',
              transform: 'translateY(0px) scale(1)',
              '&.is-animating': {
                animationName: 'hug-indicator',
                animationDuration: '750ms',
                animationFillMode: 'forwards',
                animationTimingFunction: 'ease-out',
                animationIterationCount: 1,
              },
            },
          },
        },
        '& .is-transitioning img': {
          animationName: 'cow-bounce',
          animationDuration: '500ms',
          animationFillMode: 'forwards',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        },
        '& .happiness-boosts-today': {
          bottom: '-12px',
          display: 'flex',
          justifyContent: 'space-evenly',
          left: '10%',
          position: 'absolute',
          width: '80%',
          zIndex: -1,
        },
        '& .Tumbleweeds .Tumbleweed': {
          animationName: 'move-across-screen',
          animationDuration: '5000ms',
          animationFillMode: 'forwards',
          animationTimingFunction: 'linear',
          animationIterationCount: 1,
          '& .bounce-container': {
            animationName: 'tumbleweed-bounce',
            animationDuration: '1000ms',
            animationFillMode: 'forwards',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          },
          '&::before': {
            background: 'hsla(0, 0%, 30%, 0.5)',
            borderRadius: '50%',
            bottom: '-5px',
            content: '""',
            height: '16px',
            left: '1px',
            position: 'absolute',
            width: '48px',
            zIndex: -1,
          },
        },
        '@keyframes cow-bounce': {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '20%, 80%': { transform: 'translate(0px, -32px)' },
          '40%, 60%': { transform: 'translate(0px, -48px)' },
        },
        '@keyframes tumbleweed-bounce': {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '20%, 80%': { transform: 'translate(0px, -24px)' },
          '40%, 60%': { transform: 'translate(0px, -32px)' },
        },
        '@keyframes hug-indicator': {
          '0%': { opacity: 0, transform: 'translateY(0px) scale(1)' },
          '50%': { opacity: 1, transform: 'translateY(-80px) scale(2)' },
          '100%': { opacity: 0, transform: 'translateY(-80px) scale(2)' },
        },
        '@keyframes move-across-screen': {
          '0%': { transform: 'translateX(calc(0% - 48px))' },
          '100%': { transform: 'translateX(calc(100% + 48px))' },
        },
      })}
    >
      <Tumbleweeds doSpawn={cowInventory.length === 0} />
      {cowInventory.map((cow: farmhand.cow) => (
        <Cow
          {...{
            allowCustomPeerCowNames,
            cow,
            cowInventory,
            key: cow.id,
            handleCowClick,
            playerId,
            isSelected: selectedCowId === cow.id,
          }}
        />
      ))}
    </Div>
  )
}

CowPen.propTypes = {
  allowCustomPeerCowNames: bool.isRequired,
  cowInventory: array.isRequired,
  handleCowClick: func.isRequired,
  handleCowPenUnmount: func.isRequired,
  playerId: string.isRequired,
  selectedCowId: string.isRequired,
}

export default function Consumer(props: Partial<CowPenProps>) {
  return (
    <FarmhandContext.Consumer>
      {({ gameState, handlers }) => (
        <CowPen {...{ ...gameState, ...handlers, ...props }} />
      )}
    </FarmhandContext.Consumer>
  )
}
