export const moneyTotal = (...args: number[]): number =>
  args.reduce((sum, num) => (sum += Math.round(num * 100)), 0) / 100
