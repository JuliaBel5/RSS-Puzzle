import { showLoader } from '../utils/loader'
// eslint-disable-next-line import/no-cycle
import { Game } from './game/game'
import { Header } from './header'
import { Login } from './login'
import { Start } from './start'
import { Toast } from './toast'

export class Validation {
  login: Login | undefined

  private userAuthData = { firstName: '', lastName: '' }

  start: Start | undefined

  toast: Toast | undefined

  game: Game | undefined

  user: string | undefined

  lastName: string | undefined

  header: Header | undefined

  constructor() {
    this.init()
  }

  init() {
    const catPuzzleUserData = localStorage.getItem('catPuzzleUser')
    if (catPuzzleUserData) {
      this.user = JSON.parse(catPuzzleUserData).firstName
      this.lastName = JSON.parse(catPuzzleUserData).lastName
      this.toast = new Toast()
      this.toast.bindConfirmButton(this.logout)
      if (this.user) {
        this.game = new Game(this.user)
        this.game.header.bindLogout(this.confirm)
      }
    } else {
      this.login = new Login()
      this.start = new Start()
      this.login.bindFirstNameInput(this.handleErrors)
      this.login.bindLastNameInput(this.handleErrors)
      this.login.bindSubmit(this.handleSubmit)
      this.start.bindStart(this.startScreen)
      this.toast = new Toast()
      this.toast.bindConfirmButton(this.logout)
    }
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
      this.user = firstNameValue
      this.lastName = lastNameValue
      localStorage.setItem('catPuzzleUser', JSON.stringify(this.userAuthData))

      if (this.login.gameArea) {
        this.login.gameArea.remove()
        showLoader()

        setTimeout(() => {
          this.user = this.userAuthData.firstName
          this.lastName = this.userAuthData.lastName
          if (this.start) {
            this.header = new Header()
            this.header.initStart()
            this.start.init(this.user, this.lastName)
            this.header.bindLogout(this.confirm)
          }
        }, 700)
      }
    }
  }

  startScreen = () => {
    if (this.start && this.start.gameArea && this.header) {
      this.start.gameArea.remove()
      this.header.remove()
      showLoader()
    }
    setTimeout(() => {
      this.init()
    }, 700)
  }

  handleErrors = (): void => {
    if (this.login) {
      // eslint-disable-next-line no-useless-escape
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
            this.login.firstNameInput.value.charAt(0)
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
            this.login.lastNameInput.value.charAt(0)
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

  confirm = () => {
    if (this.toast) {
      this.toast.show(`Are you sure you want to logout, ${this.user}?`)
    }
  }

  logout = () => {
    localStorage.removeItem('catPuzzleUser')
    localStorage.removeItem('catPuzzleUserData')

    if (this.game && this.game.gameArea && this.game.header) {
      this.game.gameArea.remove()
      this.game.header.remove()
    }
    if (this.start && this.start.gameArea && this.header) {
      this.start.user = ''
      this.start.lastName = ''
      this.start.gameArea.remove()
      this.header.remove()
    }
    showLoader()

    setTimeout(() => {
      this.init()
    }, 700)
  }
}
