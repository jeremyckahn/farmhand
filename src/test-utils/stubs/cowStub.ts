import { generateCow } from '../../utils/index.js'

export const getCowStub = (overrides = {}) => {
  const cow = generateCow({
    baseWeight: 1000,
    ...overrides,
  })

  return cow
}
