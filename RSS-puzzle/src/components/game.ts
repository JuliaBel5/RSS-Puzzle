import { createElement } from '../utils/createElement'
export class Game {
  gameArea: HTMLElement | undefined
  constructor() {
    this.init()
  }

  init(): void {
    this.gameArea = createElement('div', 'gamearea')
    document.body.append(this.gameArea)
    const game = createElement('div', 'game', 'Welcome to the game')
    this.gameArea.append(game)
  }
}
