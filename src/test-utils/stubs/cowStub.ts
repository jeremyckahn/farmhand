import { generateCow } from '../../utils/index.js'

/**
 * @param overrides
 */
export const getCowStub = (overrides = {}) => {
  const cow = generateCow({
    baseWeight: 1000,
    ...overrides,
  })

  return cow
}
