import { createElement } from '../utils/createElement'
//import { Music } from '../utils/Music'
const button = 'button.mp3'

export class Stats {
  overlay: HTMLElement | null
  section: HTMLElement
  stats: HTMLElement | null
  isShown: boolean

  title: HTMLDivElement | undefined
  message: HTMLDivElement | undefined
  audio: HTMLAudioElement
  statsContent: HTMLDivElement | undefined
  statsButton: HTMLButtonElement | undefined

  constructor(section: HTMLElement) {
    this.overlay = null
    this.section = section
    this.stats = null
    this.isShown = false
    this.audio = new Audio()
  }

  handleEnter = (event: KeyboardEvent) => {
    if (!event.code.endsWith('Enter')) return

    this.remove()
  }

  create(title: string, message: string) {
    this.overlay = createElement('div', 'overlay')
    this.overlay.addEventListener('click', () => {})
    this.section.append(this.overlay)
    this.stats = createElement('div', `modal0`)
    this.statsContent = createElement('div', 'modal-content')
    this.title = createElement('div', 'title', title)
    this.message = createElement('div', 'rules', message)
    this.statsButton = createElement(
      'button',
      `modal-button0`,
      'Return to the game',
    )
    this.statsButton.addEventListener('click', () => {
      this.audio.src = button
      this.audio.play()
      this.remove()
    })

    this.stats.append(this.statsContent)
    this.statsContent.append(this.title, this.message, this.statsButton)
    this.section.append(this.stats)
  }

  showModal(title: string, message: string) {
    this.isShown = true
    this.create(title, message)
    document.addEventListener('keydown', this.handleEnter)
  }

  remove() {
    if (this.stats) {
      this.isShown = false
      this.stats.remove()
      if (this.overlay) {
        this.overlay.remove()
      }

      document.removeEventListener('keydown', this.handleEnter)
    }
  }
}
