import { generateCow } from '../../utils/index.js'


export const getCowStub = (overrides: Partial<farmhand.cow>? = {}) => {
  const cow = generateCow({
    baseWeight: 1000,
    ...overrides,
  })

  return cow
}
