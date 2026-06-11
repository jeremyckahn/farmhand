import { execSync } from 'child_process'

try {
  execSync('npm run test', { stdio: 'inherit' })
} catch (e) {
  process.exit(1)
}
