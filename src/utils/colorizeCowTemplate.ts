import { Buffer } from 'buffer'

import { cowColors } from '../enums.js'
import { animals, pixel } from '../img/index.js'
import { COW_COLORS_HEX_MAP } from '../constants.js'

import { memoize } from './memoize.js'
import { Jimp } from './jimpInstance.js'

export const colorizeCowTemplate = (() => {
  const cowImageWidth = 48
  const cowImageHeight = 48
  const cowImageFactoryCanvas = document.createElement('canvas')
  cowImageFactoryCanvas.setAttribute('height', String(cowImageHeight))
  cowImageFactoryCanvas.setAttribute('width', String(cowImageWidth))

  const cachedCowImages: Record<string, string> = {}

  // https://stackoverflow.com/a/5624139
  const hexToRgb = memoize((hex: string) => {
    const [, r, g, b] = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      hex
    ) ?? ['', '0', '0', '0']

    return {
      r: parseInt(r, 16),
      g: parseInt(g, 16),
      b: parseInt(b, 16),
    }
  })

  /**
   * @param cowTemplate Base64 representation of an image
   * @param color
   * @returns Base64 representation of an image
   */
  return async (cowTemplate: string, color: farmhand.cowColors) => {
    if (color === cowColors.RAINBOW) return animals.cow.rainbow

    const imageKey = `${color}_${cowTemplate}`

    if (cachedCowImages[imageKey]) return cachedCowImages[imageKey]

    try {
      // `data:image/png;base64,` needs to be removed from the base64 string
      // before being provided to Buffer.
      // https://github.com/oliver-moran/jimp/issues/231#issuecomment-282167737
      const cowTemplateBuffer = Buffer.from(
        cowTemplate.split(',')[1] ?? '',
        'base64'
      )
      const image = await Jimp.read(cowTemplateBuffer)

      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y) {
        const { r, g, b } = Jimp.intToRGBA(image.getPixelColor(x, y))

        // rgb(102, 102, 102) represents the color to replace in the template
        // source images (#666).
        if (r === 102 && g === 102 && b === 102) {
          const cowColorRgb = hexToRgb(COW_COLORS_HEX_MAP[color])
          const colorNumber = Jimp.rgbaToInt(
            cowColorRgb.r,
            cowColorRgb.g,
            cowColorRgb.b,
            255
          )

          image.setPixelColor(colorNumber, x, y)
        }
      })

      cachedCowImages[imageKey] = await image.getBase64Async(Jimp.MIME_PNG)

      return cachedCowImages[imageKey]
    } catch (e) {
      // Jimp.read() expectedly errors out when it receives an empty buffer,
      // which it will in some unit tests.
      if (import.meta.env?.MODE !== 'test') {
        console.error(e)
      }

      return pixel
    }
  }
})()
