import './style.scss'
import { createElement } from './utils/createElement'
import { Login } from './components/login'
import { Game } from './components/game';



//const gameArea = createElement('div', 'gamearea')
//document.body.append(gameArea)

if (localStorage.getItem('catPuzzleFirstName' && 'catPuzzleLastName')) {
  console.log(localStorage.getItem('catPuzzleFirstName'))
  const game = new Game();
} else {
  const login = new Login()
}
