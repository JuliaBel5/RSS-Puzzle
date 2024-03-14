import { createElement } from '../utils/createElement'
import { Header } from './header'
import { Validation } from './validation'
import { Toast } from './toast'
import { showLoader } from '../utils/loader'
import { createImagePieces } from '../utils/createPieces'
import { shuffleAndCheck } from '../utils/shuffle'

const array: { pieces: number; letters: string[] }[] = [
  {
    pieces: 8,
    letters: 'The students agree they have too much homework'.split(' '),
  },
  { pieces: 7, letters: 'They arrived at school at 7 a.m'.split(' ') },
  { pieces: 5, letters: 'Is your birthday in August?'.split(' ') },
  { pieces: 8, letters: 'There is a small boat on the lake'.split(' ') },
  { pieces: 5, letters: 'I ate eggs for breakfast'.split(' ') },
  { pieces: 7, letters: 'I brought my camera on my vacation'.split(' ') },
  {
    pieces: 9,
    letters: 'The capital of the United States is Washington, D.C'.split(' '),
  },
  {
    pieces: 9,
    letters: 'Did you catch the ball during the baseball game?'.split(' '),
  },
  { pieces: 6, letters: 'People feed ducks at the lake'.split(' ') },
  { pieces: 6, letters: 'The woman enjoys riding her bicycle'.split(' ') },
]
export class Game {
  gameArea: HTMLElement | undefined
  toast = new Toast()
  header: Header
  user: string
  constructor(user: string) {
    this.user = user
    this.gameArea = createElement('div', 'gamearea')

    this.header = new Header(document.body)
    this.header.init()
    document.body.append(this.gameArea)
    this.header.bindLogout(this.confirm)
    this.toast.bindConfirmButton(this.logout)

    this.init()
  }

  init(): void {
    const game = createElement('div', 'game', 'Welcome to the game')
    if (this.gameArea) {
      this.gameArea.append(game)
    }

    const picture = createElement('div', 'picture', '', 'image')
    const roundContainer = createElement(
      'div',
      'round-container',
      '',
      'round-container',
    )
    roundContainer.setAttribute('draggable', 'true')
    let lineNumber = 8
    let roundArrays: HTMLElement[][] = []

    game.append(picture)
    createImagePieces(picture, roundContainer, lineNumber, roundArrays, array)

    const target = document.getElementById(lineNumber.toString())
    const gameArrLength = roundArrays[lineNumber - 1].length
    const gameArrIndexes: number[] = Array.from(
      { length: gameArrLength },
      (_, index) => index,
    )
    const shuffledGameIndArr = shuffleAndCheck(gameArrIndexes)
    shuffledGameIndArr.forEach((item) => {
      if (target) {
        const el = roundArrays[lineNumber - 1][item]
        el.style.background = `url('brown-background.jpg')`
        const tempEl = createElement('div', 'temp-el')
        const elWidth = el.style.width
        tempEl.style.width = elWidth
        tempEl.style.height = el.style.height
        target.append(tempEl)
        target.insertBefore(tempEl, el)
        roundContainer.append(el)

        el.addEventListener('click', () => {
          if (roundContainer.contains(el)) {
            //если el в строке раунда
            if (
              target.children.length === 0 || //если у строки картинки нет чайлдов,
              allChildrenHaveClass(target, 'temp-el')
            ) {
              target.innerHTML = ''
              console.log('пустая строка на картинке')

              const tempEl = createElement('div', 'temp-el')
              const elWidth = el.style.width
              tempEl.style.width = elWidth
              tempEl.style.height = el.style.height
              roundContainer.append(tempEl)
              roundContainer.insertBefore(tempEl, el)
              el.style.top = `${parseInt(el.style.height) * (10 - lineNumber + 1)}px`
              target.append(el) // переходит на картинку
              let picturePosition = picture.getBoundingClientRect()
              let position = el.getBoundingClientRect()
              let newPosition = position.top - picturePosition.top
              console.log(newPosition / 2)

              el.style.zIndex = '5'
              el.style.top = `0px`
            } else {
              console.log('непустая строка на картинке')
              const tempEl = createElement('div', 'temp-el')
              const elWidth = el.style.width
              tempEl.style.width = elWidth
              tempEl.style.height = el.style.height
              roundContainer.append(tempEl)
              roundContainer.insertBefore(tempEl, el)
              el.style.top = `${parseInt(el.style.height) * (10 - lineNumber + 1)}px`
              insertElBeforeTempEl(target, elWidth, el)
              let position = el.getBoundingClientRect()
              let newPosition = position.top
              el.style.zIndex = `5`
              el.style.top = `0px`
            }
          } else {
            //если el вверху
            if (
              roundContainer.children.length === 0 || // если строка заполнена только временными элементами
              allChildrenHaveClass(roundContainer, 'temp-el')
            ) {
              roundContainer.innerHTML = ''
              const tempEl = createElement('div', 'temp-el')
              const elWidth = el.style.width
              tempEl.style.width = elWidth
              tempEl.style.height = el.style.height
              target.append(tempEl)
              target.insertBefore(tempEl, el)

              roundContainer.append(el)
              el.style.top = `-${parseInt(el.style.height) * (10 - lineNumber + 1)}px`
              let position = el.getBoundingClientRect()
              let newPosition = position.top
              el.style.zIndex = '5'
              el.style.top = `0px`
            } else {
              const elWidth = el.style.width
              const tempEl = createElement('div', 'temp-el')
              tempEl.style.width = elWidth
              tempEl.style.height = el.style.height
              target.append(tempEl)
              target.insertBefore(tempEl, el)

              insertElBeforeTempEl(roundContainer, elWidth, el)
              el.style.top = `-${parseInt(el.style.height) * (10 - lineNumber + 1)}px`
              let position = el.getBoundingClientRect()
              let newPosition = position.top
              el.style.zIndex = '5'
              el.style.top = `0px`
            }
          }
        })
        el.style.zIndex = '2'
      }
    })

    game.append(roundContainer)
  }

  confirm = () => {
    this.toast.show(`Are you sure you want to logout, ${this.user}?`)
  }

  logout = () => {
    localStorage.removeItem('catPuzzleUser')
    if (this.gameArea && this.header) {
      this.gameArea.remove()
      this.header.remove()
    }

    showLoader()

    setTimeout(() => {
      new Validation()
    }, 500)
  }
}

function insertElBeforeTempEl(
  container: HTMLElement,
  elWidth: string,
  el: HTMLElement,
) {
  for (let i = 0; i < container.children.length; i++) {
    const child = container.children[i]
    if (child instanceof HTMLElement) {
      if (
        child.classList.contains('temp-el')
        // &&        child.style.width === elWidth
      ) {
        container.insertBefore(el, child)

        const tempElWidth = child.style.width
        container.removeChild(child)
        for (let i = 0; i < container.children.length; i++) {
          const child = container.children[i]
          if (child instanceof HTMLElement) {
            if (
              child.classList.contains('temp-el') &&
              child.style.width === elWidth
            ) {
              child.style.width = tempElWidth
            }
          }
        }
        break
      } else {
        container.append(el)
      }
    }
  }
}

function allChildrenHaveClass(
  container: HTMLElement,
  className: string,
): boolean {
  for (let i = 0; i < container.children.length; i++) {
    if (!container.children[i].classList.contains(className)) {
      return false
    }
  }
  return true
}
