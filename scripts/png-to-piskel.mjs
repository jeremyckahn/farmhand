import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '..')
const imgDir = path.join(rootDir, 'src', 'img')

const findPngFiles = dir => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const pngFiles = []

  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      pngFiles.push(...findPngFiles(entryPath))
    } else if (entry.isFile() && entry.name.endsWith('.png')) {
      pngFiles.push(entryPath)
    }
  }

  return pngFiles
}

const readPngDimensions = pngBuffer => ({
  width: pngBuffer.readUInt32BE(16),
  height: pngBuffer.readUInt32BE(20),
})

const createPiskelFromPng = pngPath => {
  const pngBuffer = fs.readFileSync(pngPath)
  const { width, height } = readPngDimensions(pngBuffer)
  const name = path.parse(pngPath).name
  const base64PNG = `data:image/png;base64,${pngBuffer.toString('base64')}`

  const layer = {
    name: 'Layer 1',
    opacity: 1,
    frameCount: 1,
    chunks: [{ layout: [[0]], base64PNG }],
  }

  const piskel = {
    modelVersion: 2,
    piskel: {
      name,
      description: '',
      fps: 12,
      height,
      width,
      layers: [JSON.stringify(layer)],
    },
  }

  const piskelPath = path.join(path.dirname(pngPath), `${name}.piskel`)
  fs.writeFileSync(piskelPath, JSON.stringify(piskel))

  return piskelPath
}

const pngFiles = findPngFiles(imgDir)
const createdPiskelFiles = []

for (const pngPath of pngFiles) {
  const piskelPath = pngPath.replace(/\.png$/, '.piskel')

  if (fs.existsSync(piskelPath)) {
    continue
  }

  createPiskelFromPng(pngPath)
  createdPiskelFiles.push(path.relative(rootDir, piskelPath))
}

if (createdPiskelFiles.length === 0) {
  console.log('No missing .piskel files found - everything is up to date.')
} else {
  console.log(`Created ${createdPiskelFiles.length} .piskel file(s):`)
  for (const piskelPath of createdPiskelFiles) {
    console.log(`  ${piskelPath}`)
  }
}
