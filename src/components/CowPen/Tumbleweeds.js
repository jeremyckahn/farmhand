import { Box } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { v4 } from 'uuid'

import { items } from '../../img/index.js'
import { scaleNumber } from '../../utils/index.js'
import { randomNumberService } from '../../common/services/randomNumber.js'

// The initial interval between tumbleweed spawns.
const initialSpawnIntervalMs = 3000

// The final, fastest interval between tumbleweed spawns.
const finalSpawnIntervalMs = 200

// The amount to decrease the spawn interval by each time a tumbleweed spawns.
const spawnIntervalDecrementAmountMs = 100

// The size in pixels of the tumbleweed sprite
const tumbleweedSize = 48

/**
 * A single tumbleweed that animates across the screen.
 * @type {React.FC<{onAnimationComplete: () => void}>}
 */
const Tumbleweed = ({ onAnimationComplete }) => {
  // Randomize the vertical position of the tumbleweed.
  const [yPosition] = useState(randomNumberService.generateRandomNumber())
  const top = scaleNumber(yPosition, 0, 1, 0, 100)

  return (
    <Box
      className="Tumbleweed"
      onAnimationEnd={onAnimationComplete}
      sx={{
        position: 'absolute',
        left: -tumbleweedSize,
        top: `${top}%`,
        width: '100%',
      }}
    >
      <Box
        className="bounce-container"
        sx={{
          height: tumbleweedSize,
          width: tumbleweedSize,
        }}
      >
        <Box
          component="img"
          src={items.tumbleweed}
          sx={{
            height: tumbleweedSize,
            width: tumbleweedSize,
          }}
        />
      </Box>
    </Box>
  )
}

/**
 * Manages the spawning of multiple Tumbleweed components.
 * @type {React.FC<{doSpawn: boolean}>}
 */
export const Tumbleweeds = ({ doSpawn }) => {
  // A list of UUIDs, each representing a Tumbleweed component.
  const [tumbleweeds, setTumbleweeds] = useState(/** @type {string[]} */ ([]))
  // The current interval between tumbleweed spawns.
  const [spawnIntervalMs, setSpawnIntervalMs] = useState(initialSpawnIntervalMs)
  // The timestamp of the last scheduled tumbleweed spawn.
  const [lastSpawnScheduledTs, setLastSpawnScheduledTs] = useState(0)

  // Adds a new tumbleweed to the list.
  const spawnTumbleweed = () => {
    setTumbleweeds(oldTumbleweeds => [...oldTumbleweeds, v4()])
  }

  // Randomize the spawn time a bit to prevent unnatural bunching of
  // tumbleweeds that can occur when the page loses focus due the behavior of
  // CSS animation timers in unfocused pages:
  // https://g.co/gemini/share/ff1ee997e30c
  const scheduleSpawnMs = scaleNumber(
    randomNumberService.generateRandomNumber(),
    0,
    1,
    0,
    spawnIntervalMs
  )

  const scheduleSpawn = useDebounceCallback(spawnTumbleweed, scheduleSpawnMs, {
    trailing: true,
  })

  // This effect manages the spawning logic.
  useEffect(() => {
    if (!doSpawn) {
      setSpawnIntervalMs(initialSpawnIntervalMs)
      scheduleSpawn.cancel()

      return
    }

    // If the spawn interval has reached its minimum, do nothing.
    if (spawnIntervalMs <= finalSpawnIntervalMs) {
      return
    }

    const now = Date.now()

    // To avoid excessive spawning, ensure that the spawn interval has elapsed
    // before scheduling a new spawn.
    if (now - lastSpawnScheduledTs < spawnIntervalMs) {
      return
    }

    scheduleSpawn()
    setLastSpawnScheduledTs(now)

    // Decrease the spawn interval to make the next spawn faster.
    setSpawnIntervalMs(
      oldSpawnIntervalMs => oldSpawnIntervalMs - spawnIntervalDecrementAmountMs
    )
  }, [doSpawn, lastSpawnScheduledTs, scheduleSpawn, spawnIntervalMs])

  /**
   * Removes a tumbleweed from the list after its animation is complete.
   * @param {string} tumbleweedUuid
   */
  const handleTumbleweedAnimationComplete = useCallback(
    tumbleweedUuid => {
      setTumbleweeds(prev => {
        return prev.filter(id => id !== tumbleweedUuid)
      })

      // If spawning is still active, schedule a new tumbleweed to maintain a constant stream.
      if (doSpawn) {
        scheduleSpawn()
      }
    },
    [doSpawn, scheduleSpawn]
  )

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
