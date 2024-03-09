import { createElement } from '../utils/createElement'
import { Header } from './header'
import { Validation } from './validation'
import { Toast } from './toast'
import { showLoader } from '../utils/loader'
export class Game {
  gameArea: HTMLElement | undefined
  toast = new Toast()
  header: Header
  user: string
  constructor(user: string) {
    this.user = user
    this.gameArea = createElement('div', 'gamearea')

    this.header = new Header(document.body)
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
