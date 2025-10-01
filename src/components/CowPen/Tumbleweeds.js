import { Box } from '@mui/material'
import { useState } from 'react'
import { useDebounceCallback, useTimeout } from 'usehooks-ts'
import { v4 } from 'uuid'

import { items } from '../../img/index.js'
import { scaleNumber } from '../../utils/index.js'

const initialSpawnIntervalMs = 3000
const finalSpawnIntervalMs = 500
const spawnIntervalDecrementAmountMs = 100
const tumbleweedRespawnTime = 2500

/**
 * @type {React.FC<{onAnimationComplete: () => void}>}
 */
const Tumbleweed = ({ onAnimationComplete }) => {
  const [yPercent] = useState(Math.random())
  const top = scaleNumber(yPercent, 0, 1, 0, 100)

  return (
    <Box
      className="Tumbleweed"
      onAnimationEnd={onAnimationComplete}
      sx={{
        position: 'absolute',
        left: -48,
        top: `${top}%`,
        width: '100%',
      }}
    >
      <Box
        className="bounce-container"
        sx={{
          height: 48,
          width: 48,
        }}
      >
        <Box
          component="img"
          src={items.tumbleweed}
          sx={{
            height: 48,
            width: 48,
          }}
        />
      </Box>
    </Box>
  )
}

/**
 * @type {React.FC<{doSpawn: boolean}>}
 */
export const Tumbleweeds = ({ doSpawn }) => {
  const [tumbleweeds, setTumbleweeds] = useState(/** @type {string[]} */ ([]))
  const [spawnIntervalMs, setSpawnIntervalMs] = useState(initialSpawnIntervalMs)

  const spawnTumbleweed = () => {
    if (!doSpawn) {
      return
    }

    setTumbleweeds(oldTumbleweeds => [...oldTumbleweeds, v4()])
  }

  const scheduleSpawn = useDebounceCallback(
    spawnTumbleweed,
    tumbleweedRespawnTime,
    {
      trailing: true,
    }
  )

  useTimeout(() => {
    if (spawnIntervalMs <= finalSpawnIntervalMs) {
      return
    }

    setSpawnIntervalMs(
      oldSpawnIntervalMs => oldSpawnIntervalMs - spawnIntervalDecrementAmountMs
    )

    spawnTumbleweed()
  }, spawnIntervalMs)

  /**
   * @param {string} tumbleweedUuid
   */
  const handleTumbleweedAnimationComplete = tumbleweedUuid => {
    setTumbleweeds(prev => {
      const idxTumbleweed = prev.indexOf(tumbleweedUuid)

      const reducedTumbleweeds = [
        ...prev.slice(0, idxTumbleweed),
        ...prev.slice(idxTumbleweed + 1),
      ]

      scheduleSpawn()

      return reducedTumbleweeds
    })
  }

  return (
    <Box
      className="Tumbleweeds"
      sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
    >
      {tumbleweeds.map(uuid => {
        return (
          <Tumbleweed
            key={uuid}
            onAnimationComplete={() => handleTumbleweedAnimationComplete(uuid)}
          />
        )
      })}
    </Box>
  )
}
