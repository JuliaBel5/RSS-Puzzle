export function shuffleArray(array: number[]) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function shuffleAndCheck(array: number[]) {
  let shuffledArray = shuffleArray([...array]);

  while (JSON.stringify(shuffledArray) === JSON.stringify(array)) {
    shuffledArray = shuffleArray([...array]);
  }

  return shuffledArray;
}
