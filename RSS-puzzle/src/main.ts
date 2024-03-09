import './style.scss'
import { Validation } from './components/validation'
import { Game } from './components/game'

const catPuzzleUserData = localStorage.getItem('catPuzzleUser')
export const state = {
  user: '',
}

if (catPuzzleUserData) {
  state.user = JSON.parse(catPuzzleUserData).firstName
  new Game(state.user)
} else {
  new Validation()
}
