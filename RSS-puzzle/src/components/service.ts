import {state} from '../main'

async function fetchData() {
  try {
     const response = await fetch(`../data/wordCollectionLevel${state.level}`);

     if (!response.ok) {
       throw new Error(`Failed to load data: ${response.status}`);
     }

     const data = await response.json();
     const roundsCount = data.roundsCount;
     const levelInfo = data.rounds[0].levelData; // Assuming you want the first level's info
     
     // Extracting round info for each round
     data.rounds.forEach((round: Round) => {
       const roundInfo = round.words.map((word: Word) => ({
         audioExample: word.audioExample,
         textExample: word.textExample,
         textExampleTranslate: word.textExampleTranslate,
         id: word.id
       }));
      console.log(roundInfo);
     });
  } catch (error) {
     console.error('Fetching data failed:', error);
  }
 }

 fetchData();


 interface Word {
  audioExample: string;
  textExample: string;
  textExampleTranslate: string;
  id: number;
  word: string;
  wordTranslate: string;
 }
 
 interface Round {
  words: Word[];
 }