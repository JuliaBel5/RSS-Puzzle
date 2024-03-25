import { createElement } from '../utils/createElement'
import { Modal } from './modal'
import { rules } from './rules'

type HandlerFunction = () => void

export class Start {
  gameArea: HTMLDivElement | undefined

  startButton: HTMLButtonElement | undefined

  user: string | undefined

  modal: Modal | undefined

  lastName: string | undefined

  audio: HTMLAudioElement | undefined

  constructor() {
    this.startButton = createElement(
      'button',
      'startButton',
      'Start the Game',
      'startButton',
    )
  }

  init(name: string, lastName: string): void {
    this.gameArea = createElement('div', 'gamearea')
    this.audio = new Audio()
    document.body.append(this.gameArea)
    this.modal = new Modal(this.gameArea)
    const container = createElement('div', 'startContainer')

    this.user = name
    this.lastName = lastName

    console.log(`Welcome to CatPuzzle game, ${this.user} ${this.lastName}!`)
    const welcome = createElement(
      'p',
      'welcomeMessage',
      `Welcome to CatPuzzle game, ${this.user} ${this.lastName}!`,
    )

    const leftPanel = createElement('div', 'leftStartPanel')
    leftPanel.style.cursor = 'pointer'
    leftPanel.addEventListener('click', () => {
      if (this.audio) {
        this.audio.src = 'meow3.mp3'
        this.audio.play()
      }
    })
    const rightPanel = createElement('div', 'rightStartPanel')
    const showRulesButton = createElement(
      'button',
      'startButton',
      'Show Game Rules',
    )
    showRulesButton.addEventListener('click', () => {
      if (this.modal) {
        this.modal.showModal('Game rules', rules)
        if (this.modal.message) {
          this.modal.message.innerHTML = rules
        }
      }
    })

    this.gameArea.append(container)
    container.append(leftPanel, rightPanel)
    if (this.startButton) {
      rightPanel.append(welcome, showRulesButton, this.startButton)
    }
  }

  bindStart = (handler: HandlerFunction): void => {
    if (this.startButton) {
      this.startButton.addEventListener('click', () => {
        handler()
      })
    }
  }
}
