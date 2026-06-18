import { cowColors } from '../enums.js'
import { animals } from '../img/index.js'

import { generateCow } from './generateCow.js'
import { getCowImage } from './getCowImage.js'

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
