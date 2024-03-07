import './style.scss'
import { Validation } from './components/validation'
import { Game } from './components/game'

const catPuzzleUserData = localStorage.getItem('catPuzzleUser')
if (catPuzzleUserData) {
 new Game()
} else {
  new Validation()
}
