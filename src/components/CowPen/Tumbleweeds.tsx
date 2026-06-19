import { Box } from '@mui/material'
import { useCallback, useEffect, useState, useRef } from 'react'
import { v4 } from 'uuid'

import { items } from '../../img/index.js'
import { scaleNumber } from '../../utils/scaleNumber.js'
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
 */
const Tumbleweed = ({
  onAnimationComplete,
}: {
  onAnimationComplete: () => void
}) => {
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
 * A custom hook that allows scheduling multiple concurrent timeouts
 * and guarantees they are all cleaned up when the component unmounts.
 */
const useConcurrentTimeout = () => {
  const activeTimeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(
    new Set()
  )

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timeoutId = setTimeout(() => {
      callback()
      activeTimeoutsRef.current.delete(timeoutId)
    }, delay)

    activeTimeoutsRef.current.add(timeoutId)
  }, [])

  const cancelAll = useCallback(() => {
    activeTimeoutsRef.current.forEach(id => clearTimeout(id))
    activeTimeoutsRef.current.clear()
  }, [])

  useEffect(() => {
    const activeTimeouts = activeTimeoutsRef.current

    return () => {
      activeTimeouts.forEach(id => clearTimeout(id))
      activeTimeouts.clear()
    }
  }, [])

  return { schedule, cancelAll }
}

/**
 * Manages the spawning of multiple Tumbleweed components.
 */
export const Tumbleweeds = ({ doSpawn }: { doSpawn: boolean }) => {
  // A list of UUIDs, each representing a Tumbleweed component.
  const [tumbleweeds, setTumbleweeds] = useState<string[]>([])
  // The current interval between tumbleweed spawns.
  const [spawnIntervalMs, setSpawnIntervalMs] = useState(initialSpawnIntervalMs)
  // The timestamp of the last scheduled tumbleweed spawn.
  const [lastSpawnScheduledTs, setLastSpawnScheduledTs] = useState(0)
  // Forces a re-render once the current spawn interval elapses to check for next spawn.
  const [tick, setTick] = useState(0)

  const { schedule, cancelAll } = useConcurrentTimeout()

  // Trigger a re-render when the next spawn interval has elapsed.
  useEffect(() => {
    if (!doSpawn) {
      return
    }

    const timeUntilNextSpawn = Math.max(
      0,
      spawnIntervalMs - (Date.now() - lastSpawnScheduledTs)
    )

    const timer = setTimeout(() => {
      setTick(t => t + 1)
    }, timeUntilNextSpawn)

    return () => clearTimeout(timer)
  }, [doSpawn, lastSpawnScheduledTs, spawnIntervalMs])

  // Adds a new tumbleweed to the list.
  const spawnTumbleweed = useCallback(() => {
    setTumbleweeds(oldTumbleweeds => [...oldTumbleweeds, v4()])
  }, [])

  // Randomize the spawn time a bit to prevent unnatural bunching of
  // tumbleweeds that can occur when the page loses focus due the behavior of
  // CSS animation timers in unfocused pages:
  // https://g.co/gemini/share/ff1ee997e30c
  const scheduleSpawn = useCallback(() => {
    const scheduleSpawnMs = scaleNumber(
      randomNumberService.generateRandomNumber(),
      0,
      1,
      0,
      spawnIntervalMs
    )

    schedule(spawnTumbleweed, scheduleSpawnMs)
  }, [schedule, spawnIntervalMs, spawnTumbleweed])

  // This effect manages the spawning logic.
  useEffect(() => {
    if (!doSpawn) {
      setSpawnIntervalMs(initialSpawnIntervalMs)
      cancelAll()

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
  }, [
    cancelAll,
    doSpawn,
    lastSpawnScheduledTs,
    scheduleSpawn,
    spawnIntervalMs,
    tick,
  ])

  /**
   * Removes a tumbleweed from the list after its animation is complete.
   */
  const handleTumbleweedAnimationComplete = useCallback(
    (tumbleweedUuid: string) => {
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
