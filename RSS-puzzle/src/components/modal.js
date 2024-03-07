import { createElement } from '../utils/createElement'
import { Music } from '../utils/Music'
import { state } from '../main'
const button = 'button.mp3'
export class Modal {
  constructor(section, model) {
    this.overlay = null
    this.section = section
    this.modal = null
    this.isShown = false
    this.audio = new Music()
  }

  handleEnter = (event) => {
    if (!event.code.endsWith('Enter')) return

    this.remove()
  }

  create(title, message) {
    this.overlay = createElement('div', 'overlay')
    this.overlay.addEventListener('click', () => {})
    this.section.append(this.overlay)
    this.modal = createElement('div', `modal${state.theme}`)
    this.modalContent = createElement('div', 'modal-content')
    this.title = createElement('div', 'title', title)
    this.message = createElement('div', 'message', message)
    this.modalButton = createElement(
      'button',
      `modal-button${state.theme}`,
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

  showModal(title, message) {
    this.isShown = true
    this.create(title, message)
    document.addEventListener('keydown', this.handleEnter)
  }

  remove() {
    if (this.modal) {
      this.isShown = false
      this.modal.remove()
      this.overlay.remove()

      document.removeEventListener('keydown', this.handleEnter)
    }
  }
}
