import { createElement } from '../utils/createElement'
import { Header } from './header'
import { Validation } from './validation'
import { Toast } from './toast'
import { showLoader } from '../utils/loader'
import { ImagePieceData, createImagePieces } from '../utils/createPieces'
import { shuffleAndCheck } from '../utils/shuffle'
import { state } from '../main'
import { LevelDataResult, transformLevelData } from './levels'

export class Game {
  gameArea: HTMLElement | undefined
  toast = new Toast()
  header: Header
  user: string
  roundContainer: HTMLDivElement | undefined
  roundArrays: HTMLElement[][] | undefined
  autoCompleteButton: HTMLButtonElement | undefined
  translationContainer: HTMLDivElement | undefined
  game: HTMLDivElement | undefined
  picture: HTMLDivElement | undefined
  level: LevelDataResult | undefined
  array: ImagePieceData[] | undefined
  continueButton: HTMLButtonElement | undefined
  audio: HTMLAudioElement | undefined

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

  async init(): Promise<void> {
    await this.useLevelData()

    if (this.level) {
      this.array = this.level.transformedData[state.round - 1].words
      console.log(this.level.transformedData[0])
      state.backgroundUrl = `url('https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${this.level.transformedData[state.round - 1].imageSRC}')`
      //`url("/${this.level.transformedData[state.round - 1].imageSRC}")`
      state.audioSrc = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/${this.level.transformedData[state.round - 1].audioSrc[state.lineNumber - 1]}`
      //`${this.level.transformedData[state.round - 1].audioSrc[state.lineNumber - 1]}`
      this.game = createElement('div', 'game', '')
      this.audio = new Audio()
      this.audio.src = state.audioSrc
      this.audio.volume = 0.3
      this.translationContainer = createElement(
        'div',
        'translation-container',
        ` Здесь будет перевод`,
      )

      this.translationContainer.textContent = `${this.level.transformedData[state.round - 1].translation[state.lineNumber - 1]}`
      if (this.gameArea) {
        this.gameArea.append(this.game)
      }

      this.picture = createElement('div', 'picture', '', 'image')
      this.picture.style.background = `linear-gradient(black, black), ${state.backgroundUrl}`
      this.picture.style.backgroundBlendMode = `saturation`;
      //state.backgroundUrl
    
      this.continueButton = createElement(
        'button',
        'disabled2',
        'Check',
        'check',
      )
      this.autoCompleteButton = createElement(
        'button',
        'disabled2',
        'Help me',
        'check',
      )

      this.roundContainer = createElement(
        'div',
        'round-container',
        '',
        'round-container',
      )

      this.continueButton.addEventListener('click', () => {
        const target = document.getElementById(`${state.lineNumber}`)
        if (target && this.continueButton) {
          target.style.border = ''
          if (this.continueButton.textContent === 'Check') {
            this.verifyLine(target, this.continueButton)
          } else if (this.continueButton.textContent === 'Continue') {
            this.continue(
              state.lineNumber,
              state.round,
              state.level,
            )
          }
        }
      })

      this.autoCompleteButton.addEventListener('click', () => {
        const target = document.getElementById(`${state.lineNumber}`)
        if (target && this.continueButton) {
          const children = target.children
          const elementsWithIds = Array.from(children).map((child) => ({
            element: child,
            idNum: parseInt(child.id.split('-')[1], 10),
          }))
          elementsWithIds.sort((a, b) => a.idNum - b.idNum)

          target.innerHTML = ''
          this.continueButton.classList.add('continue')
          this.continueButton.classList.remove('disabled2')
        
          elementsWithIds.forEach((item) => {
            target.appendChild(item.element)
            if (item.element instanceof HTMLElement) {
            
            }
          })
          if (this.audio) {
          this.audio.src = 'Bibip.mp3'
          this.audio.play()
          }
      }
      })
      this.roundArrays = []

      this.game.append(
        this.translationContainer,
        this.picture,
        this.roundContainer,
        this.autoCompleteButton,
        this.continueButton,
      )
      createImagePieces(
        this.picture,
        this.roundContainer,
        state.lineNumber,
        this.roundArrays,
        this.array,
      )
      this.startGame(
        this.roundArrays,
        this.roundContainer,
        state.lineNumber,
        this.continueButton,
      )

      this.header.bindTranslationTipOn(this.translationTipOn)
      this.header.bindAudioTipOn(this.audioTipOn)
      this.header.bindBackgroundTipOn(this.backgroundTipOn)
      this.header.bindRoundSelect(this.roundSelect)
      this.header.bindLevelSelect(this.levelSelect)
      this.translationContainer.style.visibility = 'hidden'
    }
  }

  startGame = (
    roundArrays: HTMLElement[][],
    roundContainer: HTMLElement,
    lineNumber: number,
    continueButton: HTMLElement,
  ) => {
     this.autoCompleteButton?.classList.remove('continue')
    this.autoCompleteButton?.classList.add('disabled2')
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
        target.style.display = 'flex'
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
                (this.autoCompleteButton &&
                  this.allChildrenHaveClass(roundContainer, 'temp-el')) ||
                (this.autoCompleteButton &&
                  roundContainer.children.length === 0)
              ) {
                continueButton.classList.remove('disabled2')
                continueButton.classList.add('continue')
                this.autoCompleteButton.classList.remove('disabled2')
                this.autoCompleteButton.classList.add('continue')
                continueButton.textContent = 'Check'
              } else if (this.autoCompleteButton) {
                continueButton.classList.remove('continue')
                continueButton.classList.add('disabled2')
                this.autoCompleteButton.classList.remove('continue')
                this.autoCompleteButton.classList.add('disabled2')
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
                (this.autoCompleteButton &&
                  this.allChildrenHaveClass(roundContainer, 'temp-el')) ||
                (this.autoCompleteButton &&
                  roundContainer.children.length === 0)
              ) {
                continueButton.classList.remove('disabled2')
                continueButton.classList.add('continue')
                this.autoCompleteButton.classList.remove('disabled2')
                this.autoCompleteButton.classList.add('continue')
                continueButton.textContent = 'Check'
              } else if (this.autoCompleteButton) {
                continueButton.classList.remove('continue')
                continueButton.classList.add('disabled2')
                this.autoCompleteButton.classList.remove('continue')
                this.autoCompleteButton.classList.add('disabled2')
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
                (this.autoCompleteButton &&
                  this.allChildrenHaveClass(roundContainer, 'temp-el')) ||
                (this.autoCompleteButton &&
                  roundContainer.children.length === 0)
              ) {
                continueButton.classList.remove('disabled2')
                continueButton.classList.add('continue')
                this.autoCompleteButton.classList.remove('disabled2')
                this.autoCompleteButton.classList.add('continue')
                continueButton.textContent = 'Check'
              } else if (this.autoCompleteButton) {
                continueButton.classList.remove('continue')
                continueButton.classList.add('disabled2')
                this.autoCompleteButton.classList.remove('continue')
                this.autoCompleteButton.classList.add('disabled2')
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
                (this.autoCompleteButton &&
                  this.allChildrenHaveClass(roundContainer, 'temp-el')) ||
                (this.autoCompleteButton &&
                  roundContainer.children.length === 0)
              ) {
                continueButton.classList.remove('disabled2')
                continueButton.classList.add('continue')
                this.autoCompleteButton.classList.remove('disabled2')
                this.autoCompleteButton.classList.add('continue')
                continueButton.textContent = 'Check'
              } else if (this.autoCompleteButton) {
                continueButton.classList.remove('continue')
                continueButton.classList.add('disabled2')
                this.autoCompleteButton.classList.remove('continue')
                this.autoCompleteButton.classList.add('disabled2')
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

        if (draggableElement && dropzone && draggableElement.parentElement) {
          const dropzoneRect = dropzone.getBoundingClientRect()
          const dropzoneCenterY = dropzoneRect.top + dropzoneRect.height / 2
          const draggableElementRect = draggableElement.getBoundingClientRect()
          const draggableElementCenterY =
            draggableElementRect.top + draggableElementRect.height / 2
            const lineData =
                draggableElement.parentElement.getAttribute('data-line')
          if (dropzone.parentNode && state.lineNumber === Number(lineData) ) {
          if (draggableElementCenterY < dropzoneCenterY ) {
            dropzone.parentNode.insertBefore(draggableElement, dropzone)
              } if( draggableElementCenterY > dropzoneCenterY)  {
            dropzone.parentNode.insertBefore(
              draggableElement,
              dropzone.nextSibling,
            )
          }
          const allTempEl = Array.from(document.querySelectorAll('.temp-el'))
          allTempEl.map((el) => {
            if (el instanceof HTMLElement) {
              if (el.style.width === draggableElement.style.width) {
                el.parentNode?.removeChild(el)
              }
            }
          
          })

          //TODO добавить логику удаления временных элементов
        }
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
        if (this.audio) {
          this.audio.src = 'error.mp3'
          this.audio.play()
          }
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
      if (this.audio) {
        this.audio.src = 'solution.wav'
        this.audio.play()
        }
    }
  }
  continue = (
    lineNumber: number,
    round: number,
    level: number,
  ): void => {
    if (lineNumber <= 9) {
      state.lineNumber += 1
      this.updateLine()
      if (this.audio) {
        this.audio.src = 'Collapse.mp3'
        this.audio.play()
        }
    } else if (
      lineNumber > 9 &&
      round < state.roundsCount &&
      this.autoCompleteButton &&
      this.level
    ) {
      state.round += 1
      
      this.updateRound()
      if (this.audio) {
        this.audio.src = 'newround2.mp3'
        this.audio.play()
        }
    } else if (round === state.roundsCount && level <= 5) {
      state.level += 1
   
      this.updateLevel()
     
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

      if (allChildrenHavePictureBackground && this.header.backgroundTip instanceof HTMLImageElement) {
        this.header.backgroundTip.src ='backgroundTipDis.png'
        childrenArray.forEach((child) => {
          if (
            child instanceof HTMLElement &&
            !child.classList.contains('temp-el')
          ) {
            child.style.backgroundImage = `url("brown-background.jpg")`
          }
        })
      } else if (allChildrenHaveBrownBackground && this.header.backgroundTip instanceof HTMLImageElement) {
        this.header.backgroundTip.src = 'backgroundTip1.png'
        childrenArray.forEach((child) => {
          if (
            child instanceof HTMLElement &&
            !child.classList.contains('temp-el')
          ) {
            child.style.backgroundImage = state.backgroundUrl
            if (this.audio) {
              this.audio.src = 'zviak.mp3'
              this.audio.play()
              }
          }
        })
      } else {
        childrenArray.forEach((child) => {
          if (
            child instanceof HTMLElement &&
            !child.classList.contains('temp-el')
          ) {
            child.style.backgroundImage = `url('brown-background.jpg')`
          }
        })
      }
    }
  }
  audioTipOn = (): void => {
    if (this.audio) {
      this.audio.src = state.audioSrc
       this.audio.play();
       if (this.header.audioTip && this.header.audioTip instanceof HTMLImageElement) {
       this.header.audioTip.src = 'audioTipDis.png'

       this.audio.addEventListener('ended', () => {
        if (this.header.audioTip && this.header.audioTip instanceof HTMLImageElement) {
        this.header.audioTip.src = 'audioTip1.png'
        }
       });
      }
    }
   }

  translationTipOn = (): void => {
    if (this.translationContainer && this.header.translationTip instanceof HTMLImageElement) {
      if (this.translationContainer.style.visibility === 'hidden') {
        this.translationContainer.style.visibility = 'visible'
        this.header.translationTip.src = 'translationTip1.png'
        if (this.audio) {
          this.audio.src = 'dzing.mp3'
          this.audio.play()
          }
        
      } else {
        this.translationContainer.style.visibility = 'hidden'
        this.header.translationTip.src = 'translationTipDis.png'
      }
    }
  }
  async useLevelData() {
    const useLevelData = await transformLevelData(state.level)
    this.level = useLevelData
    state.roundsCount = this.level.roundsCount
    
  }

  updateLine(): void {
    if (this.translationContainer && this.level && this.continueButton && this.audio) {
      state.audioSrc = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/${this.level.transformedData[state.round - 1].audioSrc[state.lineNumber - 1]}`
      //`${this.level.transformedData[state.round - 1].audioSrc[state.lineNumber - 1]}`
     
      this.audio.src = state.audioSrc
      state.translation = `${this.level.transformedData[state.round - 1].translation[state.lineNumber - 1]}`
      this.translationContainer.textContent = state.translation
      this.continueButton.classList.add('disabled2')
      this.continueButton.classList.remove('continue')
      this.autoCompleteButton?.classList.add('disabled2')
      this.autoCompleteButton?.classList.remove('continue')
      this.continueButton.textContent = 'Check'
    
  }

    if (this.roundArrays && this.roundContainer && this.continueButton) {
      this.startGame(
        this.roundArrays,
        this.roundContainer,
        state.lineNumber,
        this.continueButton,
      )
      const target = document.getElementById(state.lineNumber.toString())
      if (target) {
        target.style.border = ''
      }
    }
    if (this.header.backgroundTip && this.header.backgroundTip instanceof HTMLImageElement) {
      this.header.backgroundTip.src = 'backgroundTipDis.png'
    } 
    if ( this.header.translationTip && this.header.translationTip instanceof HTMLImageElement && this.translationContainer) {
      this.header.translationTip.src = 'translationTipDis.png'
      this.translationContainer.style.visibility = 'hidden'
    }
    
    
  }

  updateRound(): void {
    state.lineNumber = 1
    if (this.level) {
      this.roundArrays = []

      state.backgroundUrl = `url('https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${this.level.transformedData[state.round - 1].imageSRC}')`
      //`url("/${this.level.transformedData[state.round - 1].imageSRC}")`

      this.array = this.level.transformedData[state.round - 1].words
      if (this.roundContainer && this.picture) {
        this.picture.innerHTML = ''
        this.picture.style.background = `linear-gradient(black, black), ${state.backgroundUrl}`
        this.picture.style.backgroundBlendMode = `saturation`;
        createImagePieces(
          this.picture,
          this.roundContainer,
          state.lineNumber,
          this.roundArrays,
          this.array,
        )
        this.updateLine()
      }
      if (this.header.roundSelect)
        this.header.roundSelect.value = `${state.round}`
    }
    if (this.audio) {
      this.audio.src = 'newround2.mp3'
      this.audio.play()
      }
  }

  async updateLevel() {
    state.round = 1
    console.log('state round', state.round)
    await this.useLevelData()
    this.updateRound()
    if (this.header.levelSelect) {
      this.header.levelSelect.value = `${state.level}`
    }
    if (this.audio) {
      this.audio.src = 'newlevel.mp3'
      this.audio.play()
      }
  }

  roundSelect = () => {
    if (this.header.roundSelect) {
      state.round = Number(this.header.roundSelect.value)
      this.updateRound()
    }
  }

  levelSelect = () => {
    if (this.header.levelSelect) {
      state.level = Number(this.header.levelSelect.value)
     
      console.log('state level', state.level)
      this.updateLevel()
    }
  }
}
