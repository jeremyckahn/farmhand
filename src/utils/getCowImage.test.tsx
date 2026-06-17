import {
    cowColors,
    cropLifeStage
} from '../enums.js'
import { animals } from '../img/index.js'

import {
    generateCow,
    getCowImage
} from './index.js'


const { SEED, GROWING, GROWN } = cropLifeStage

const percentageStringTests = [
  [0, '0%'],
  [0.5, '50%'],
  [1, '100%'],
  [1.5, '150%'],
  [2, '200%'],
]

const dollarStringTests = [
  [0, '$0.00'],
  [0.5, '$0.50'],
  [1, '$1.00'],
  [1.5, '$1.50'],
  [2, '$2.00'],
]

const integerStringTests = [
  [0, '0'],
  [0.5, '1'],
  [1, '1'],
  [1.5, '2'],
  [2, '2'],
]


describe('getCowImage', () => {
  test('colors a cow template image', async () => {
    const cow = generateCow({ color: cowColors.GREEN, id: '1' })
    const image = await getCowImage(cow)

    // image data can viewed with https://jaredwinick.github.io/base64-image-viewer/
    expect(image).toMatchSnapshot()
  })

  test('does not modify rainbow cow image', async () => {
    const cow = generateCow({ color: cowColors.RAINBOW })
    const image = await getCowImage(cow)

    expect(image).toEqual(animals.cow.rainbow)
  })
})
