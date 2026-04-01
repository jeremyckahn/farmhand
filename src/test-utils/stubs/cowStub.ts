import { generateCow } from '../../utils/index.tsx'

/**
 * @param {Partial<farmhand.cow>?} overrides
 */
export const getCowStub = (overrides = {}) => {
  const cow = generateCow({
    baseWeight: 1000,
    ...overrides,
  })

  return cow
}
