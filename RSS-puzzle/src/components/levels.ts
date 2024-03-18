import { state } from '../main'

export async function transformLevelData(
  level: number,
): Promise<LevelDataResult> {
  // Dynamically import the JSON file based on the level number
  const { default: levelFile } = await import(
    `../data/wordCollectionLevel${level}.json`
  )

  // Transform the data
  const transformedData: TransformedData[] = levelFile.rounds.map(
    (el: Round): TransformedData => {
      return {
        imageSRC: el.levelData.cutSrc,
        words: el.words.map((word: Word) => {
          return {
            pieces: word.textExample.split(' ').length,
            letters: word.textExample.split(' '),
          }
        }),
        audio: el.words.map((word) => word.audioExample),
        translation: el.words.map((word) => word.textExampleTranslate),
      }
    },
  )

  return {
    transformedData,
    roundsCount: levelFile.roundsCount,
  }
}
// Generate constants for each level
// export const level = transformLevelData();
/* export const level2 = transformLevelData(2);
 export const level3 = transformLevelData(3);
 export const level4 = transformLevelData(4);
 export const level5 = transformLevelData(5);
 export const level6 = transformLevelData(6);*/

interface Word {
  audioExample: string
  textExample: string
  textExampleTranslate: string
  id: number
  word: string
  wordTranslate: string
}

interface LevelData {
  id: string
  name: string
  imageSrc: string
  cutSrc: string
  author: string
  year: string
}

interface Round {
  levelData: LevelData
  words: Word[]
}

interface Data {
  rounds: Round[]
  roundsCount: number
}

interface TransformedData {
  imageSRC: string
  words: {
    pieces: number
    letters: string[]
  }[]
  audio: string[]
  translation: string[]
}
export interface LevelDataResult {
  transformedData: TransformedData[]
  roundsCount: number
}
