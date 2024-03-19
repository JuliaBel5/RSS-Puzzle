import './style.scss'
import { Validation } from './components/validation'
import { Game } from './components/game'

const catPuzzleUserData = localStorage.getItem('catPuzzleUser')
export const state = {
  user: '',
  lastName: '',
  level: 1,
  round: 1,
  lineNumber: 1,
  roundsCount: 1,
  audioSrc: '',
  translation: '',
  backgroundUrl: `url('https://github.com/rolling-scopes-school/rss-puzzle-data/blob/main/images/level6/6_07.jpg?raw=true')`,
  translationTip: false,
  audioTip: false,
  backgroundTip: false,
}

if (catPuzzleUserData) {
  state.user = JSON.parse(catPuzzleUserData).firstName
  state.lastName = JSON.parse(catPuzzleUserData).lastName
  new Game(state.user)
} else {
  new Validation()
}
