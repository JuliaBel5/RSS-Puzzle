import { createElement } from '../utils/createElement'
import { Game } from './game'

export class Login {
  gameArea: HTMLElement | undefined

  constructor() {
    this.init()
  }

  init(): void {
    this.gameArea = createElement('div', 'gamearea')
    document.body.append(this.gameArea)
    const container = createElement('div', `container`)
    const welcome = createElement('p', 'welcomeMessage', "Welcome to CatPuzzle game!")
    const buttonContainer = createElement('div', 'inputContainer')
    const leftPanel = createElement('div', 'leftPanel')
    const rightPanel = createElement('div', 'rightPanel')
    const firstNameLabel = createElement('label', 'label', 'First Name')
    const firstNameInput = createElement('input', 'input', '', 'firstName')
    firstNameLabel.htmlFor = 'firstName'
    const firstNameError = createElement('p', 'error', '', 'firstNameError')
    const lastNameLabel = createElement('label', 'label', 'Surname')
    const lastNameInput = createElement('input', 'input', '', 'lastName')
    lastNameLabel.htmlFor = 'lastName'
    const lastNameError = createElement('p', 'error', '', 'lastNameError')
    const loginButton = createElement('button', 'disabled', 'Login', 'loginButton')
    this.gameArea.append(container)
    container.append(leftPanel, rightPanel)
    rightPanel.append(welcome, buttonContainer)
    buttonContainer.append(
      firstNameLabel,
      firstNameInput,
      firstNameError,
      lastNameLabel,
      lastNameInput,
      lastNameError,
      loginButton,
    )
  
   firstNameInput.addEventListener('input', handleErrors);
   lastNameInput.addEventListener('input', handleErrors)

    loginButton.addEventListener('click', () => {
      const firstNameValue = firstNameInput.value.trim()
      const lastNameValue = lastNameInput.value.trim()
      if (firstNameValue && lastNameValue) {
        localStorage.setItem("catPuzzleFirstName", firstNameValue)
        localStorage.setItem("catPuzzleLastName", lastNameValue)
        if (this.gameArea) {
          this.gameArea.remove()
          const game = new Game()
        }
      }
    })
  }
}


function  handleErrors():void {
  const firstNameInput = document.getElementById('firstName')
  const lastNameInput  = document.getElementById('lastName')
  const loginButton = document.getElementById('loginButton')
  const firstNameError = document.getElementById('firstNameError');
  const lastNameError = document.getElementById('lastNameError');

  if (firstNameInput instanceof HTMLInputElement && lastNameInput instanceof HTMLInputElement) {
  const firstNameValue = firstNameInput.value.trim()
  const lastNameValue = lastNameInput.value.trim()
  if (loginButton && firstNameValue && firstNameError && lastNameError && lastNameValue)  {
    loginButton.classList.remove('disabled');
    loginButton.classList.add('loginButton');
    firstNameError.textContent = '';
    lastNameError.textContent = '';
   
  } else if (loginButton && firstNameError && lastNameError &&!firstNameValue && !lastNameValue) {
    firstNameError.textContent = 'First name is required';
    lastNameError.textContent = 'Last name is required';
    loginButton.classList.remove('loginButton');
    loginButton.classList.add('disabled');

  } else if (loginButton && firstNameError && lastNameError &&!firstNameValue) {
    firstNameError.textContent = 'First name is required';
    lastNameError.textContent = '';
    loginButton.classList.remove('loginButton');
    loginButton.classList.add('disabled');
  } else if (loginButton && lastNameError && firstNameError && !lastNameValue) {
    lastNameError.textContent = 'Last name is required';
    firstNameError.textContent = '';
    loginButton.classList.remove('loginButton');
    loginButton.classList.add('disabled');
  } 
}
};


