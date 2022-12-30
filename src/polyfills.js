import { Buffer } from 'buffer'

import process from 'process/browser'

// Polyfill
window.Buffer = Buffer
window.process = process
