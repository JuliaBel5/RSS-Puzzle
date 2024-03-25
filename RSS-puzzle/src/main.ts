import './style.scss'
// eslint-disable-next-line import/no-cycle
import { Validation } from './components/validation'

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
  backgroundUrl: '',
  translationTip: true,
  audioTip: true,
  backgroundTip: true,
  autocomplete: false,
  isPlaying: false,
}

if (catPuzzleUserData) {
  state.user = JSON.parse(catPuzzleUserData).firstName
  state.lastName = JSON.parse(catPuzzleUserData).lastName
  /* new Game(state.user)
} else { */
}
new Validation()
