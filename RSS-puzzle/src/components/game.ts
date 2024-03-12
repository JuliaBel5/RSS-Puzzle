import { createElement } from '../utils/createElement'
import { Header } from './header'
import { Validation } from './validation'
import { Toast } from './toast'
import { showLoader } from '../utils/loader'
import { createImagePieces } from '../utils/createPieces'
export class Game {
  gameArea: HTMLElement | undefined
  toast = new Toast()
  header: Header
  user: string
  constructor(user: string) {
    this.user = user
    this.gameArea = createElement('div', 'gamearea')

    this.header = new Header(document.body)
    this.header.init()
    document.body.append(this.gameArea)
    this.header.bindLogout(this.confirm)
    this.toast.bindConfirmButton(this.logout)

    this.init()
  }

  init(): void {
    const game = createElement('div', 'game', 'Welcome to the game')
    if (this.gameArea) {
      this.gameArea.append(game)
    }

    const picture = createElement('div', 'picture', '', 'image')
    game.append(picture)
    createImagePieces([
      { pieces: 8, letters: ("The students agree they have too much homework").split(' ') },
      { pieces: 7, letters:("They arrived at school at 7 a.m").split(' ')},
      { pieces: 5, letters: ("Is your birthday in August?").split(' ')},
      { pieces: 8, letters: ("There is a small boat on the lake").split(' ')},
      { pieces: 5, letters: ("I ate eggs for breakfast").split(' ') },
      { pieces: 7, letters: ("I brought my camera on my vacation").split(' ')},
      { pieces: 9, letters: ("The capital of the United States is Washington, D.C").split(' ')},
      { pieces: 9, letters: ("Did you catch the ball during the baseball game?").split(' ')},
      { pieces: 6, letters: ("People feed ducks at the lake").split(' ')},
      { pieces: 6, letters:("The woman enjoys riding her bicycle").split(' ')},
    ])
  }
  confirm = () => {
    this.toast.show(`Are you sure you want to logout, ${this.user}?`)
  }

  logout = () => {
    localStorage.removeItem('catPuzzleUser')
    if (this.gameArea && this.header) {
      this.gameArea.remove()
      this.header.remove()
    }

    showLoader()

    setTimeout(() => {
      new Validation()
    }, 500)
  }
}
