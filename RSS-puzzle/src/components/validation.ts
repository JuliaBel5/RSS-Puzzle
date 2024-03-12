import { showLoader } from '../utils/loader'
import { Game } from './game'
import { Start } from './start'
import { Login } from './login'
import { state } from '../main'

export class Validation {
  login: Login
  private userAuthData = { firstName: '', lastName: '' }
  start: Start
  constructor() {
    this.login = new Login()
    this.start = new Start()
    this.login.bindFirstNameInput(this.handleErrors)
    this.login.bindLastNameInput(this.handleErrors)
    this.login.bindSubmit(this.handleSubmit)
    this.start.bindStart(this.startScreen)
  }

  handleSubmit = (): void => {
    if (
      !this.login ||
      !(this.login.firstNameInput instanceof HTMLInputElement) ||
      !(this.login.lastNameInput instanceof HTMLInputElement)
    ) {
      throw new Error("It's not an input element")
    }

    const { firstNameInput, lastNameInput } = this.login
    const firstNameValue = firstNameInput.value.trim()
    const lastNameValue = lastNameInput.value.trim()

    if (firstNameValue && lastNameValue) {
      this.userAuthData.firstName = firstNameValue
      this.userAuthData.lastName = lastNameValue
      localStorage.setItem('catPuzzleUser', JSON.stringify(this.userAuthData))

      if (this.login.gameArea) {
        this.login.gameArea.remove()
        showLoader()

        setTimeout(() => {
          state.user = this.userAuthData.firstName
          this.start.init()
        }, 500)
      }
    }
  }
  startScreen = () => {
    if (this.start.gameArea) {
      this.start.gameArea.remove()
      showLoader()
    }
    setTimeout(() => {
      new Game(state.user)
    }, 500)
  }

  handleErrors = (): void => {
    if (this.login) {
      const alphaHyphenPattern = /^[A-Za-z\-]+$/
      const uppercaseFirstLetterPattern = /^[A-Z]/

      if (
        this.login.firstNameInput instanceof HTMLInputElement &&
        this.login.lastNameInput instanceof HTMLInputElement &&
        this.login.firstNameError &&
        this.login.lastNameError &&
        this.login.loginButton
      ) {
        this.login.firstNameError.textContent = ''
        this.login.lastNameError.textContent = ''
        this.login.loginButton.classList.remove('this.login.loginButton')
        this.login.loginButton.classList.add('disabled')

        if (
          this.login.firstNameInput.value &&
          !alphaHyphenPattern.test(this.login.firstNameInput.value)
        ) {
          this.login.firstNameError.textContent =
            'Please, use English alphabet letters and hyphen'
        } else if (
          this.login.firstNameInput.value &&
          !uppercaseFirstLetterPattern.test(
            this.login.firstNameInput.value.charAt(0),
          )
        ) {
          this.login.firstNameError.textContent =
            'First name must begin with an uppercase letter'
        } else if (
          this.login.firstNameInput.value &&
          this.login.firstNameInput.value.length < 3
        ) {
          this.login.firstNameError.textContent =
            'First name must be at least 3 characters long'
        } else if (this.login.firstNameInput.value) {
          this.login.firstNameError.textContent = ''
        }

        if (
          this.login.lastNameInput.value &&
          !alphaHyphenPattern.test(this.login.lastNameInput.value)
        ) {
          this.login.lastNameError.textContent =
            'Please, use English alphabet letters and hyphen'
        } else if (
          this.login.lastNameInput.value &&
          !uppercaseFirstLetterPattern.test(
            this.login.lastNameInput.value.charAt(0),
          )
        ) {
          this.login.lastNameError.textContent =
            'Last name must begin with an uppercase letter'
        } else if (
          this.login.lastNameInput.value &&
          this.login.lastNameInput.value.length < 4
        ) {
          this.login.lastNameError.textContent =
            'Last name must be at least 4 characters long'
        } else if (this.login.lastNameInput.value) {
          this.login.lastNameError.textContent = ''
        }

        if (
          this.login.firstNameInput.value &&
          this.login.lastNameInput.value &&
          !this.login.firstNameError.textContent &&
          !this.login.lastNameError.textContent
        ) {
          this.login.loginButton.classList.remove('disabled')
          this.login.loginButton.classList.add('loginButton')
        }
      }
    }
  }
}
