import isEmpty from 'lodash/isEmpty';

export const isVowel = (str: string) => {
  const char = (!isEmpty(str) && str.charAt(0)) || '';
  return /^[aeiou]$/.test(char.toLowerCase());
};
