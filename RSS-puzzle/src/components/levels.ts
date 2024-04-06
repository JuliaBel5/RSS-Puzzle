export async function transformLevelData(
  level: number
): Promise<LevelDataResult> {
  const { default: levelFile } = await import(
    `../data/wordCollectionLevel${level}.json`
  )

  const transformedData: TransformedData[] = levelFile.rounds.map(
    (el: Round): TransformedData => {
      return {
        imageSRC: el.levelData.cutSrc,
        name: el.levelData.name,
        author: el.levelData.author,
        year: el.levelData.year,
        words: el.words.map((word: Word) => {
          return {
            pieces: word.textExample.split(' ').length,
            letters: word.textExample.split(' ')
          }
        }),
        audioSrc: el.words.map((word) => word.audioExample),
        translation: el.words.map((word) => word.textExampleTranslate)
      }
    }
  )

  return {
    transformedData,
    roundsCount: levelFile.roundsCount
  }
}

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

interface TransformedData {
  imageSRC: string
  name: string
  author: string
  year: string
  words: {
    pieces: number
    letters: string[]
  }[]
  audioSrc: string[]
  translation: string[]
}
export interface LevelDataResult {
  transformedData: TransformedData[]
  roundsCount: number
}
