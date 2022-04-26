export const shortcode = (length = 3) => {
  const vowels = 'aeiou'
  const consonants = 'bcdfghjklmnpqrstvwxyz'
  let word = ''
  let set

  for (let i = 0; i < length; i++) {
    set = (i % 2 === 0) ? consonants : vowels
    word += set[Math.floor(Math.random() * set.length)]
  }

  return word
}
