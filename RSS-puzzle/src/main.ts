import './style.scss'
import { Validation } from './components/validation'
import { Game } from './components/game'

const catPuzzleUserData = localStorage.getItem('catPuzzleUser')
export const state = {
  user: '',
  lastName: '',
}

if (catPuzzleUserData) {
  state.user = JSON.parse(catPuzzleUserData).firstName
  state.lastName = JSON.parse(catPuzzleUserData).lastName
  new Game(state.user)
} else {
  new Validation()
}
