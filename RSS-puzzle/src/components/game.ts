import { createElement } from '../utils/createElement'
import { Header } from './header'
import { Validation } from './validation'
import { Toast } from './toast'
import { showLoader } from '../utils/loader'
import { createImagePieces } from '../utils/createPieces'
import { shuffleAndCheck } from '../utils/shuffle'
import { state } from '../main'

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
  roundContainer: HTMLDivElement | undefined
  roundArrays: HTMLElement[][] | undefined
  
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
    const game = createElement('div', 'game', '')
    if (this.gameArea) {
      this.gameArea.append(game)
    }

    const picture = createElement('div', 'picture', '', 'image')
    const continueButton = createElement(
      'button',
      'disabled2',
      'Check',
      'check',
    )

    this.roundContainer = createElement(
      'div',
      'round-container',
      '',
      'round-container',
    )

    continueButton.addEventListener('click', () => {
      const target = document.getElementById(`${state.lineNumber}`)
          if (target) {
        target.style.border = ''
        if (continueButton.textContent === 'Check') {
          this.verifyLine(target, continueButton)
        } else if (continueButton.textContent === 'Continue') {
          this.continue(
            continueButton,
            state.lineNumber,
            state.round,
            state.level,
          )
        }
      }
    })
    this.roundArrays = []

    game.append(picture, this.roundContainer, continueButton)
    createImagePieces(
      picture,
      this.roundContainer,
      state.lineNumber,
      this.roundArrays,
      array,
    )
    this.startRound(
      this.roundArrays,
      this.roundContainer,
      state.lineNumber,
      continueButton,
    )
    let target = document.getElementById(state.lineNumber.toString())
    
      this.header.bindTranslationTipOn(this.translationTipOn)
      this.header.bindAudioTipOn(this.audioTipOn)
      this.header.bindBackgroundTipOn(this.backgroundTipOn)
    
  }
  startRound = (
    roundArrays: HTMLElement[][],
    roundContainer: HTMLElement,
    lineNumber: number,
    continueButton: HTMLElement,
  ) => {
    console.log(state.lineNumber, 'line number')
    roundContainer.innerHTML = ''
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
        //  el.style.background = `url('brown-background.jpg')`
        target.style.border = ''
        const elWidth = el.style.width
        const elHeight = el.style.height
        const tempEl = this.createTemp(elWidth, elHeight)
        target.append(tempEl)
        target.insertBefore(tempEl, el)
        roundContainer.append(el)

        el.addEventListener('click', () => {
          if (roundContainer.contains(el)) {
            //если el в строке раунда
            if (
              target.children.length === 0 || //если у строки картинки нет чайлдов,
              this.allChildrenHaveClass(target, 'temp-el')
            ) {
              target.innerHTML = ''
              
              const elWidth = el.style.width
              const elHeight = el.style.height
              const tempEl = this.createTemp(elWidth, elHeight)
              roundContainer.append(tempEl)
              roundContainer.insertBefore(tempEl, el)

              el.style.top = `${parseInt(el.style.height) * (10 - lineNumber + 1)}px`
              target.append(el) // переходит на картинку

              el.getBoundingClientRect()
              el.style.zIndex = '5'
              el.style.top = `0px`

              if (
                this.allChildrenHaveClass(roundContainer, 'temp-el') ||
                roundContainer.children.length === 0
              ) {
                continueButton.classList.remove('disabled2')
                continueButton.classList.add('continue')
                continueButton.textContent = 'Check'
              } else {
                continueButton.classList.remove('continue')
                continueButton.classList.add('disabled2')
                continueButton.textContent = 'Check'
              }
            } else {
              
              const elWidth = el.style.width
              const elHeight = el.style.height
              const tempEl = this.createTemp(elWidth, elHeight)
              roundContainer.append(tempEl)
              roundContainer.insertBefore(tempEl, el)
              el.style.top = `${parseInt(el.style.height) * (10 - lineNumber + 1)}px`
              this.insertElBeforeTempEl(target, elWidth, el)
              el.getBoundingClientRect()
              el.style.zIndex = `5`
              el.style.top = `0px`
              if (
                this.allChildrenHaveClass(roundContainer, 'temp-el') ||
                roundContainer.children.length === 0
              ) {
                continueButton.classList.remove('disabled2')
                continueButton.classList.add('continue')
                continueButton.textContent = 'Check'
              } else {
                continueButton.classList.remove('continue')
                continueButton.classList.add('disabled2')
                continueButton.textContent = 'Check'
              }
            }
          } else {
            //если el вверху
            if (
              roundContainer.children.length === 0 || // если строка заполнена только временными элементами
              this.allChildrenHaveClass(roundContainer, 'temp-el')
            ) {
              roundContainer.innerHTML = ''

              const elWidth = el.style.width
              const elHeight = el.style.height
              const tempEl = this.createTemp(elWidth, elHeight)
              target.append(tempEl)
              target.insertBefore(tempEl, el)

              roundContainer.append(el)
              el.style.top = `-${parseInt(el.style.height) * (10 - lineNumber + 1)}px`
              el.getBoundingClientRect()
              el.style.zIndex = '5'
              el.style.top = `0px`
              if (
                this.allChildrenHaveClass(roundContainer, 'temp-el') ||
                roundContainer.children.length === 0
              ) {
                continueButton.classList.remove('disabled2')
                continueButton.classList.add('continue')
                continueButton.textContent = 'Check'
              } else {
                continueButton.classList.remove('continue')
                continueButton.classList.add('disabled2')
                continueButton.textContent = 'Check'
              }
            } else {
              const elWidth = el.style.width
              const elHeight = el.style.height
              const tempEl = this.createTemp(elWidth, elHeight)
              target.append(tempEl)
              target.insertBefore(tempEl, el)

              this.insertElBeforeTempEl(roundContainer, elWidth, el)
              el.style.top = `-${parseInt(el.style.height) * (10 - lineNumber + 1)}px`
              el.getBoundingClientRect()
              el.style.zIndex = '5'
              el.style.top = `0px`
              if (
                this.allChildrenHaveClass(roundContainer, 'temp-el') ||
                roundContainer.children.length === 0
              ) {
                continueButton.classList.remove('disabled2')
                continueButton.classList.add('continue')
                continueButton.textContent = 'Check'
              } else {
                continueButton.classList.remove('continue')
                continueButton.classList.add('disabled2')
                continueButton.textContent = 'Check'
              }
            }
          }
        })
        el.style.zIndex = '2'
      }
    })
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

  allChildrenHaveClass(container: HTMLElement, className: string): boolean {
    for (let i = 0; i < container.children.length; i++) {
      if (!container.children[i].classList.contains(className)) {
        return false
      }
    }
    return true
  }

  insertElBeforeTempEl(
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
  createTemp(elWidth: string, elHeight: string): HTMLElement {
    const tempEl = createElement('div', 'temp-el')
    tempEl.style.width = elWidth
    tempEl.style.height = elHeight
    tempEl.addEventListener('dragstart', function (e) {
      if (e.dataTransfer && e.target && e.target instanceof HTMLElement) {
        e.dataTransfer.setData('text', e.target.id)
      }
    })
    tempEl.addEventListener('drop', (e) => {
      e.preventDefault()
      if (e.dataTransfer && e.target && e.target instanceof HTMLElement) {
        const id = e.dataTransfer.getData('text')
        const draggableElement = document.getElementById(id)
        const dropzone = e.target

        if (draggableElement && dropzone) {
          const dropzoneRect = dropzone.getBoundingClientRect()
          const dropzoneCenterY = dropzoneRect.top + dropzoneRect.height / 2
          const draggableElementRect = draggableElement.getBoundingClientRect()
          const draggableElementCenterY =
            draggableElementRect.top + draggableElementRect.height / 2

          if (
            dropzone.parentNode &&
            draggableElementCenterY < dropzoneCenterY
          ) {
            dropzone.parentNode.insertBefore(draggableElement, dropzone)
          } else if (dropzone.parentNode) {
            dropzone.parentNode.insertBefore(
              draggableElement,
              dropzone.nextSibling,
            )
          }
          const allTempEl = Array.from(document.querySelectorAll('.temp-el'))
                   allTempEl.map((el) => {
              if (el instanceof HTMLElement) {
                if (el.style.width === draggableElement.style.width) {
                   return
            }
          }
          })
          

          //TODO добавить логику удаления временных элементов
        }
      }
    })
    tempEl.addEventListener('dragover', (e) => {
      e.preventDefault()
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move'
      }
    })
    return tempEl
  }
  verifyLine(target: HTMLElement, button: HTMLElement): void {
    const childrenArray = Array.from(target.children)
    const idsAfterDash = childrenArray.map((el) => {
      const id = el.id
      const parts = id.split('-')
      return parseInt(parts[1], 10)
    })

    let isOrderCorrect = true
    for (let i = 0; i < idsAfterDash.length - 1; i++) {
      if (idsAfterDash[i] > idsAfterDash[i + 1]) {
        isOrderCorrect = false
        button.textContent = 'Check'
        button.classList.add('disabled2')
        target.style.border = '2px solid red'
        break
        //TODO подсветить ошибки
      }
    }

    if (isOrderCorrect) {
      button.textContent = 'Continue'
      button.classList.add('continue')
      button.classList.remove('disabled2')
      target.style.border = '2px solid green'
      childrenArray.forEach((child) => {
        if (child instanceof HTMLElement) {
          child.style.backgroundImage = state.backgroundUrl
          const backgroundPosition = child.getAttribute('background-position')
          if (backgroundPosition !== null) {
            child.style.background = state.backgroundUrl
            child.style.backgroundPosition = backgroundPosition
          }
        }
      })
      //TODO подключить селекты
    }
  }
  continue = (
    button: HTMLElement,
    lineNumber: number,
    round: number,
    level: number,
  ): void => {
    
    
    if (lineNumber <= 9) {
      state.lineNumber += 1
      button.classList.add('disabled2')
      button.textContent = 'Check'
      if (this.roundArrays && this.roundContainer) {
        this.startRound(
          this.roundArrays,
          this.roundContainer,
          state.lineNumber,
          button,
        )
        const target = document.getElementById(state.lineNumber.toString())
           if(target) {
      target.style.border = ""
    }
      }
    } else if (lineNumber > 9 && round < 41) {
      state.round = 1 + round
      button.classList.add('disabled2')
    } else if (round === 41 && level <= 5) {
      state.level = level + 1
      button.classList.add('disabled2')
    } else {
      console.log('You won')
    }
  
  }
  backgroundTipOn = (): void => {
    const target = document.getElementById(state.lineNumber.toString())
    if (target) {
      console.log('target available')
    const childrenArray = Array.from(target.children)

    const allChildrenHavePictureBackground = childrenArray.every((child) => {
      return (
        child instanceof HTMLElement &&
        child.style.backgroundImage === state.backgroundUrl
      )
    })
    const allChildrenHaveBrownBackground = childrenArray.every((child) => {
      return (
        child instanceof HTMLElement &&
        child.style.backgroundImage === `url("brown-background.jpg")`
      )
    })

    if (allChildrenHavePictureBackground) {
      childrenArray.forEach((child) => {
        if (child instanceof HTMLElement && !child.classList.contains('temp-el')) {
          child.style.backgroundImage = `url("brown-background.jpg")`
        }
      })
    } else if (allChildrenHaveBrownBackground) {
      childrenArray.forEach((child) => {
        if (child instanceof HTMLElement && !child.classList.contains('temp-el')) {
          child.style.backgroundImage = state.backgroundUrl
        }
      })
    } else {
      childrenArray.forEach((child) => {
        if (child instanceof HTMLElement && !child.classList.contains('temp-el')) {
          child.style.backgroundImage = `url('brown-background.jpg')`
        }
      })
    }
  }
  }
  audioTipOn = (): void => {
    const target = document.getElementById(state.lineNumber.toString())
    if (target) {
    const childrenArray = Array.from(target.children)
    childrenArray.forEach((child) => {
      //some logic to add later
    })
    }
  }

  translationTipOn = (): void => {
    const target = document.getElementById(state.lineNumber.toString())
    if (target) {
    const childrenArray = Array.from(target.children)
    childrenArray.forEach((child) => {
      if (child instanceof HTMLElement) {
        //some logic to add later
      }
    })
    }
  }
}
