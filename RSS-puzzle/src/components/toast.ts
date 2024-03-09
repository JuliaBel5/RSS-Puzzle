import { createElement } from '../utils/createElement'

type HandlerFunction = () => void

export class Toast {
  private toastContainer: HTMLElement
  confirmButton: HTMLButtonElement
  cancelButton: HTMLButtonElement
  toast: HTMLDivElement
  buttonContainer: HTMLDivElement
  timeoutId: number | undefined

  constructor() {
    this.toastContainer = createElement('div', 'toast-container', '')
    document.body.appendChild(this.toastContainer)

    this.buttonContainer = createElement('div', 'toast-button-container')
    this.confirmButton = createElement('button', 'toast-confirm-button', 'Yes')
    this.cancelButton = createElement('button', 'toast-cancel-button', 'No')
    this.toast = createElement('div', 'toast', '')
    this.buttonContainer.append(this.confirmButton, this.cancelButton)
    this.toastContainer.append(this.toast, this.buttonContainer)

    this.cancelButton.addEventListener('click', () => {
      this.toastContainer.classList.add('hide')
      this.toastContainer.classList.remove('show')
      clearTimeout(this.timeoutId)
    })
  }

  public show = (message: string, duration: number = 8000): void => {
    this.toastContainer.classList.remove('hide')
    this.toastContainer.classList.add('show')
    this.toast.textContent = message

    this.timeoutId = setTimeout(() => {
      if (this.toastContainer.classList.contains('show')) {
        this.toastContainer.classList.add('hide')
      }
      this.toastContainer.classList.remove('show')
    }, duration)
  }

  bindConfirmButton = (handler: HandlerFunction) =>
    this.confirmButton.addEventListener('click', () => {
      handler()
      this.toastContainer.remove()
    })
}
