import configureJimp from '@jimp/custom'
import jimpPng from '@jimp/png'
export const Jimp = configureJimp({
  types: [jimpPng],
})
