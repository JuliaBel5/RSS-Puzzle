import { createElement } from '../utils/createElement'
import { Music } from '../utils/Music'
const button = 'button.mp3'

export class Modal {
  overlay: HTMLElement | null
  section: HTMLElement
  modal: HTMLElement | null
  isShown: boolean
  audio: Music
  modalContent: HTMLDivElement | undefined
  title: HTMLDivElement | undefined
  message: HTMLDivElement | undefined
  modalButton: HTMLButtonElement | undefined

  constructor(section: HTMLElement) {
    this.overlay = null
    this.section = section
    this.modal = null
    this.isShown = false
    this.audio = new Music()
  }

  handleEnter = (event: KeyboardEvent) => {
    if (!event.code.endsWith('Enter')) return

    this.remove()
  }

  create(title: string, message: string) {
    this.overlay = createElement('div', 'overlay')
    this.overlay.addEventListener('click', () => {})
    this.section.append(this.overlay)
    this.modal = createElement('div', `modal0`)
    this.modalContent = createElement('div', 'modal-content')
    this.title = createElement('div', 'title', title)
    this.message = createElement('div', 'rules', message)
    this.modalButton = createElement(
      'button',
      `modal-button0`,
      'Return to the game',
    )
    this.modalButton.addEventListener('click', () => {
      this.audio.play(button)
      this.remove()
    })

    this.modal.append(this.modalContent)
    this.modalContent.append(this.title, this.message, this.modalButton)
    this.section.append(this.modal)
  }

  showModal(title: string, message: string) {
    this.isShown = true
    this.create(title, message)
    document.addEventListener('keydown', this.handleEnter)
  }

  remove() {
    if (this.modal) {
      this.isShown = false
      this.modal.remove()
      if (this.overlay) {
        this.overlay.remove()
      }

      document.removeEventListener('keydown', this.handleEnter)
    }
  }
}