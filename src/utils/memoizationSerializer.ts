export const memoizationSerializer = (args: unknown[]) =>
  JSON.stringify(
    [...args].map(arg => (typeof arg === 'function' ? arg.toString() : arg))
  )
