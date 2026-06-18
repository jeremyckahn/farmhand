export const convertStringToInteger = (string: string): number =>
  string.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * i, 0)
