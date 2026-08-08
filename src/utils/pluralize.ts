export const pluralize = (
  word: string,
  count: number,
  pluralForm: string = `${word}s`
): string => (count === 1 ? word : pluralForm)
