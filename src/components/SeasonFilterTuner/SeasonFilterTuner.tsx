// TEMPORARY DEV TOOL - for live-tuning the seasonal CSS `filter` values in
// src/data/seasons.ts. Delete this file and its mount point in Stage.tsx
// once the values are finalized - do not commit this.
import React, { useEffect, useState } from 'react'

import { season } from '../../enums.js'
import { seasonNameMap } from '../../data/seasons.js'
import { getCurrentSeason } from '../../utils/getCurrentSeason.js'

interface FilterValues {
  sepia: number
  hueRotate: number
  saturate: number
  brightness: number
  contrast: number
}

// Seeded from the current production seasonFilterMap (src/data/seasons.ts)
// so the panel starts each season where it currently stands. Keep these in
// sync by hand as seasonFilterMap changes - this is a throwaway tool.
const initialValuesBySeason: Record<season, FilterValues> = {
  [season.SPRING]: {
    sepia: 0,
    hueRotate: 0,
    saturate: 1,
    brightness: 1,
    contrast: 1,
  },
  [season.SUMMER]: {
    sepia: 0.25,
    hueRotate: -8,
    saturate: 1.3,
    brightness: 1.15,
    contrast: 1,
  },
  [season.FALL]: {
    sepia: 0.4,
    hueRotate: -20,
    saturate: 1.35,
    brightness: 0.97,
    contrast: 1,
  },
  [season.WINTER]: {
    sepia: 0.59,
    hueRotate: 129,
    saturate: 0.98,
    brightness: 0.93,
    contrast: 1.02,
  },
}

const sliders: Array<{
  key: keyof FilterValues
  min: number
  max: number
  step: number
}> = [
  { key: 'sepia', min: 0, max: 1, step: 0.01 },
  { key: 'hueRotate', min: -180, max: 180, step: 1 },
  { key: 'saturate', min: 0, max: 2, step: 0.01 },
  { key: 'brightness', min: 0, max: 2, step: 0.01 },
  { key: 'contrast', min: 0, max: 2, step: 0.01 },
]

const buildFilterString = ({
  sepia,
  hueRotate,
  saturate,
  brightness,
  contrast,
}: FilterValues) =>
  `sepia(${sepia}) hue-rotate(${hueRotate}deg) saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`

export const SeasonFilterTuner = ({ dayCount }: { dayCount: number }) => {
  const [valuesBySeason, setValuesBySeason] = useState(initialValuesBySeason)
  const currentSeason = getCurrentSeason(dayCount)
  const values = valuesBySeason[currentSeason]
  const filterString = buildFilterString(values)

  useEffect(() => {
    const stageBackground = document.querySelector(
      '.stage-background'
    ) as HTMLElement | null

    if (stageBackground) {
      stageBackground.style.filter = filterString
    }

    return () => {
      if (stageBackground) {
        stageBackground.style.filter = ''
      }
    }
  }, [filterString])

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1em',
        right: '1em',
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.85)',
        color: '#fff',
        padding: '1em',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        width: '320px',
      }}
    >
      <strong>
        Season filter tuner (temporary) - editing {seasonNameMap[currentSeason]}
      </strong>
      {sliders.map(({ key, min, max, step }) => (
        <div key={key} style={{ margin: '0.5em 0' }}>
          <label>
            {key}: {values[key]}
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={values[key]}
              onChange={event =>
                setValuesBySeason(previousValuesBySeason => ({
                  ...previousValuesBySeason,
                  [currentSeason]: {
                    ...previousValuesBySeason[currentSeason],
                    [key]: Number(event.target.value),
                  },
                }))
              }
              style={{ width: '100%' }}
            />
          </label>
        </div>
      ))}
      <div style={{ marginTop: '0.5em', wordBreak: 'break-all' }}>
        {filterString}
      </div>
    </div>
  )
}
