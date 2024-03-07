import { createElement, createInputElement } from '../utils/createElement'
type HandlerFunction = () => void

export class Login {
  gameArea: HTMLElement | undefined
  firstNameInput: HTMLInputElement | undefined
  firstNameError: HTMLParagraphElement | undefined
  lastNameInput: HTMLInputElement | undefined
  lastNameError: HTMLParagraphElement | undefined
  loginButton: HTMLButtonElement | undefined

  constructor() {
    this.init()
  }

  init(): void {
    this.gameArea = createElement('div', 'gamearea')
    document.body.append(this.gameArea)
    const container = createElement('div', `container`)
    const welcome = createElement(
      'p',
      'welcomeMessage',
      'Welcome to CatPuzzle game!',
    )
    const buttonContainer = createElement('form', 'inputContainer')
    const leftPanel = createElement('div', 'leftPanel')
    const rightPanel = createElement('div', 'rightPanel')
    const firstNameLabel = createElement('label', 'label', 'First Name')
    this.firstNameInput = createInputElement(
      'input',
      'input',
      '',
      'firstName',
      { required: true },
    )
    firstNameLabel.htmlFor = 'firstName'
    this.firstNameError = createElement('p', 'error', '', 'firstNameError')
    const lastNameLabel = createElement('label', 'label', 'Surname')
    this.lastNameInput = createInputElement('input', 'input', '', 'lastName', {
      required: true,
    })
    lastNameLabel.htmlFor = 'lastName'
    this.lastNameError = createElement('p', 'error', '', 'lastNameError')
    this.loginButton = createElement(
      'button',
      'disabled',
      'Login',
      'loginButton',
    )
    this.gameArea.append(container)
    container.append(leftPanel, rightPanel)
    rightPanel.append(welcome, buttonContainer)
    buttonContainer.append(
      firstNameLabel,
      this.firstNameInput,
      this.firstNameError,
      lastNameLabel,
      this.lastNameInput,
      this.lastNameError,
      this.loginButton,
    )

    this.firstNameInput.oninvalid = (e: Event) => {
      ;(e.target as HTMLInputElement).setCustomValidity(
        'Please enter your first name.',
      )
    }
    this.firstNameInput.oninput = (e: Event) => {
      ;(e.target as HTMLInputElement).setCustomValidity('')
    }

    this.lastNameInput.oninvalid = (e: Event) => {
      ;(e.target as HTMLInputElement).setCustomValidity(
        'Please enter your last name.',
      )
    }
    this.lastNameInput.oninput = (e: Event) => {
      ;(e.target as HTMLInputElement).setCustomValidity('')
    }
  }
  bindFirstNameInput(handler: HandlerFunction): void {
    if (this.firstNameInput instanceof HTMLInputElement) {
      this.firstNameInput.addEventListener('input', () => {
        handler()
      })
    }
  }

  bindLastNameInput(handler: HandlerFunction): void {
    if (this.lastNameInput instanceof HTMLInputElement) {
      this.lastNameInput.addEventListener('input', () => {
        handler()
      })
    }
  }
  bindSubmit(handler: HandlerFunction): void {
    if (this.loginButton) {
      this.loginButton.addEventListener('click', () => {
        handler()
      })
    }
  }
}
