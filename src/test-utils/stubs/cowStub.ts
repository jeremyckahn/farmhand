import { generateCow } from '../../utils/generateCow.js'

export const getCowStub = (overrides = {}) => {
  const cow = generateCow({
    baseWeight: 1000,
    ...overrides,
  })

  return cow
}
