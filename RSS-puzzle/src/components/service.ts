import { state } from '../main';

async function fetchData() {
  try {
    const response = await fetch(`../data/wordCollectionLevel${state.level}`);

    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.status}`);
    }

    const data = await response.json();

    data.rounds.forEach((round: Round) => {
      const roundInfo = round.words.map((word: Word) => ({
        audioExample: word.audioExample,
        textExample: word.textExample,
        textExampleTranslate: word.textExampleTranslate,
        id: word.id,
      }));
      console.log(roundInfo);
    });
  } catch (error) {
    console.error('Fetching data failed:', error);
  }
}

fetchData();

interface Word {
  audioExample: string
  textExample: string
  textExampleTranslate: string
  id: number
  word: string
  wordTranslate: string
}

interface Round {
  words: Word[]
}

export async function fetchAndTransformData() {
  try {
    const response = await fetch(
      `https://github.com/rolling-scopes-school/rss-puzzle-data/blob/main/data/wordCollectionLevel${state.level}.json`,
    );
    // Parse the JSON data
    const data = await response.json();

    // Transform the data into the desired array format
    const array = data.rounds.flatMap((round: Round) => {
      return round.words.map((word: Word) => {
        return {
          pieces: word.textExample.split(' ').length,
          letters: word.textExample.split(' '),
        };
      });
    });
    console.log(array);
  } catch (error) {
    console.error('Error:', error);
  }
}
