/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line import/no-cycle
import { state } from '../../main'
import { createElement } from '../../utils/createElement'
import { createImagePieces, ImagePieceData } from '../../utils/createPieces'
import {
  allChildrenHaveClass,
  insertElBeforeTempEl,
  insertElBeforeDropzoneAndRemoveDuplicate,
  disableButton,
  unableButton
} from '../../utils/utils'
import { shuffleAndCheck } from '../../utils/shuffle'
import { Header, changeOptionColor } from '../header'
import { LevelDataResult, transformLevelData } from '../levels'
import { Stats } from '../stats'
import { UserData, UserStats } from './types'
// import { Toast } from './toast'
// import { Validation } from './validation'

export class Game {
  gameArea: HTMLElement | undefined

  // toast = new Toast()

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

  userData: UserData

  stats: Stats | undefined

  userStats: UserStats | undefined

  audioElement: HTMLImageElement | undefined

  audioContainer: HTMLDivElement | undefined

  settingsContainer: HTMLDivElement | undefined

  catElement: HTMLImageElement | undefined

  constructor(user: string) {
    this.user = user
    this.gameArea = createElement('div', 'gamearea')
    this.stats = new Stats(this.gameArea)
    this.header = new Header()
    this.header.init()
    document.body.append(this.gameArea)
    //   this.header.bindLogout(this.confirm)
    // this.toast.bindConfirmButton(this.logout)

    this.userData = {
      lineNumber: 1,
      round: 1,
      level: 1,
      autocomplete: false
    }
    if (localStorage.getItem('catPuzzleUserData')) {
      this.getSavedUserData()
    } else {
      this.init()
    }
  }

  async init(): Promise<void> {
    await this.useLevelData()

    if (this.level) {
      this.array = this.level.transformedData[state.round - 1].words

      state.backgroundUrl = `url('https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${this.level.transformedData[state.round - 1].imageSRC}')`
      // `url("/${this.level.transformedData[state.round - 1].imageSRC}")`
      state.audioSrc = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/${this.level.transformedData[state.round - 1].audioSrc[state.lineNumber - 1]}`
      // `${this.level.transformedData[state.round - 1].audioSrc[state.lineNumber - 1]}`
      this.game = createElement('div', 'game', '')
      this.audio = new Audio()
      this.audio.src = state.audioSrc
      this.audio.volume = 0.3
      this.translationContainer = createElement(
        'div',
        'translation-container',
        ''
      )

      this.settingsContainer = createElement('div', 'settings-container', '')
      this.audioElement = createElement('img', 'mini-audio0')
      this.audioElement.src = 'audioTip1.png'
      this.audioElement.addEventListener('click', () => {
        if (this.audio) {
          this.audio.src = state.audioSrc
          this.audio.play()
          if (this.audioElement instanceof HTMLImageElement) {
            this.audioElement.src = 'audioTipDis.png'
            this.audio.addEventListener('ended', () => {
              if (
                this.audioElement &&
                this.audioElement instanceof HTMLImageElement
              ) {
                this.audioElement.src = 'audioTip1.png'
              }
            })
          }
        }
      })
      this.catElement = createElement('img', 'mini-cat')
      this.catElement.src = 'cat6a.png'
      this.catElement.style.display = 'none'
      this.catElement.addEventListener('click', () => {
        if (this.audio) {
          this.audio.src = 'meow2.mp3'
          this.audio.volume = 0.3
          this.audio.play()
        }
      })
      this.settingsContainer.append(
        this.catElement,
        this.audioElement,
        this.translationContainer
      )
      this.game.append(this.settingsContainer)
      this.translationContainer.textContent = `${this.level.transformedData[state.round - 1].translation[state.lineNumber - 1]}`
      if (this.gameArea) {
        this.gameArea.append(this.game)
      }

      this.picture = createElement('div', 'picture', '', 'image')
      this.picture.style.background = `linear-gradient(black, black), ${state.backgroundUrl}`
      this.picture.style.backgroundBlendMode = 'saturation'

      this.continueButton = createElement(
        'button',
        'continue',
        'Check',
        'check'
      )
      this.autoCompleteButton = createElement(
        'button',
        'continue',
        'Help me',
        'autocomplete'
      )

      this.roundContainer = createElement(
        'div',
        'round-container',
        '',
        'round-container'
      )

      this.continueButton.addEventListener('click', () => {
        const target = document.getElementById(`${state.lineNumber}`)
        if (target && this.continueButton) {
          target.style.border = ''
          if (this.continueButton.textContent === 'Check') {
            this.verifyLine(target, this.continueButton)
          } else if (this.continueButton.textContent === 'Continue') {
            this.continue(state.lineNumber, state.round, state.level)
          }
        }
      })

      this.autoCompleteButton.addEventListener('click', () => {
        if (this.autoCompleteButton?.textContent === 'Help me') {
          const target = document.getElementById(`${state.lineNumber}`)
          const selector = `[data-line ="${state.lineNumber}"]:not(.line-container)`
          const children = Array.from(document.querySelectorAll(selector))
          if (target && this.continueButton) {
            const elementsWithIds = Array.from(children).map((child) => ({
              element: child,
              idNum: Number.parseInt(child.id.split('-')[1], 10)
            }))
            elementsWithIds.sort((a, b) => a.idNum - b.idNum)

            target.innerHTML = ''
            unableButton(this.continueButton, 'disabled2', 'continue')
            disableButton(this.autoCompleteButton, 'disabled2', 'continue')
            elementsWithIds.forEach((item) => {
              target.append(item.element)
            })
            if (this.audio) {
              this.audio.src = 'Bibip.mp3'
              this.audio.play()
            }
            this.userData.autocomplete = true
            this.saveUserData()
            state.autocomplete = true
          }
        } else if (this.autoCompleteButton?.textContent === 'Results') {
          if (this.userStats && this.stats && this.audio) {
            const statsContent = `${this.userStats.name}, ${this.userStats.author}, ${this.userStats.year}`
            this.audio.src = 'stats.mp3'
            this.audio.play()
            this.stats.showStats(
              `Level ${state.level} Round ${state.round} results:`,
              statsContent
            )
            if (this.stats.miniPicture) {
              this.stats.miniPicture.style.backgroundImage = state.backgroundUrl
            }

            Object.entries(this.userStats.stats).forEach(
              ([lineNumber, autocompleteStatus]) => {
                if (this.level) {
                  const levelAudio = new Audio(
                    `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/${this.level.transformedData[state.round - 1].audioSrc[Number(lineNumber) - 1]}`
                  )

                  const iconElement = createElement('img', 'mini-audio')
                  iconElement.src = 'audioTip1.png'
                  iconElement.addEventListener('click', () => {
                    levelAudio.play()
                  })

                  const levelElement = createElement(
                    'div',
                    'level-line',
                    `Line ${lineNumber}: ${autocompleteStatus ? 'with help' : 'without help'}`
                  )

                  levelElement.append(iconElement)
                  if (
                    this.stats &&
                    autocompleteStatus === true &&
                    this.stats.helpedLinesTitleContent
                  ) {
                    this.stats.helpedLinesTitleContent.append(levelElement)
                  } else if (
                    this.stats &&
                    autocompleteStatus === false &&
                    this.stats.completedLinesTitleContent
                  ) {
                    this.stats.completedLinesTitleContent.append(levelElement)
                  }
                }
              }
            )
          }
        }
      })
      this.roundArrays = []

      this.game.append(
        this.picture,
        this.roundContainer,
        this.autoCompleteButton,
        this.continueButton
      )
      createImagePieces(
        this.picture,
        this.roundArrays,
        this.array,
        state.backgroundUrl
      )
      this.startGame(
        this.roundArrays,
        this.roundContainer,
        state.lineNumber
        //   this.continueButton
      )

      this.header.bindTranslationTipOn(this.translationTipOn)
      this.header.bindAudioTipOn(this.audioTipOn)
      this.header.bindBackgroundTipOn(this.backgroundTipOn)
      this.header.bindRoundSelect(this.roundSelect)
      this.header.bindLevelSelect(this.levelSelect)
      this.translationContainer.style.visibility = 'visible'

      this.userStats = {
        level: state.level,
        round: state.round,
        author: this.level.transformedData[state.round - 1].author,
        name: this.level.transformedData[state.round - 1].name,
        year: this.level.transformedData[state.round - 1].year,
        stats: {
          1: null,
          2: null,
          3: null,
          4: null,
          5: null,
          6: null,
          7: null,
          8: null,
          9: null,
          10: null
        }
      }
      if (this.header.levelSelect && this.header.roundSelect) {
        this.header.levelSelect.value = state.level.toString()
        this.header.roundSelect.value = state.round.toString()
      }
    }

    const mediaQueryAbove1000 = window.matchMedia('(min-width: 1001px)')
    const mediaQueryBelow1000 = window.matchMedia('(max-width: 999px)')

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        this.updateLevel()
      }
    }

    mediaQueryAbove1000.addEventListener('change', handleMediaQueryChange)
    mediaQueryBelow1000.addEventListener('change', handleMediaQueryChange)

    if (mediaQueryAbove1000.matches) {
      this.updateLevel()
    }

    if (mediaQueryBelow1000.matches) {
      this.updateLevel()
    }
    document.addEventListener('lineIsCompleted', () => {
      if (this.continueButton && this.autoCompleteButton) {
        unableButton(this.continueButton, 'disabled2', 'continue')
        unableButton(this.autoCompleteButton, 'disabled2', 'continue')
      }
    })

    document.addEventListener('lineIsNotCompleted', () => {
      if (this.continueButton && this.autoCompleteButton) {
        disableButton(this.continueButton, 'disabled2', 'continue')
      }
    })
  }

  private startGame = (
    roundArrays: HTMLElement[][],
    roundContainer: HTMLElement,
    lineNumber: number
    // continueButton: HTMLElement
  ) => {
    roundContainer.innerHTML = ''
    const target = document.getElementById(lineNumber.toString())
    const gameArrLength = roundArrays[lineNumber - 1].length
    const gameArrIndexes: number[] = Array.from(
      { length: gameArrLength },
      (_, index) => index
    )
    const lineNumberArr = Array.from(
      { length: state.lineNumber - 1 },
      (_, i) => 1 + i
    )
    lineNumberArr.forEach((num) => {
      const selector = `.line-container[data-line="${num}"]`
      const resultContainer = document.querySelector(selector)
      if (resultContainer instanceof HTMLElement) {
        resultContainer.style.display = 'flex'
        const childrenArray = Array.from(resultContainer.children)
        childrenArray.forEach((child) => {
          if (child instanceof HTMLElement) {
            child.style.backgroundImage = state.backgroundUrl
          }
        })
      }
    })
    const shuffledGameIndArr = shuffleAndCheck(gameArrIndexes)
    shuffledGameIndArr.forEach((item) => {
      if (target) {
        target.style.display = 'flex'
        const el = roundArrays[lineNumber - 1][item]
        //  el.style.background = `url('brown-background.jpg')`
        el.style.backgroundImage = state.backgroundUrl
        target.style.border = ''
        roundContainer.append(el)

        el.addEventListener('click', () => {
          if (roundContainer.contains(el)) {
            // если el в строке раунда
            this.handleElClick(el, roundContainer, target, 1)
          } else {
            // если el в строке картинки
            this.handleElClick(el, target, roundContainer, -1)
          }
          this.verifyChildrenLength()
        })
      }
    })
    roundContainer.addEventListener('drop', (e): void => {
      this.dropHandler(e, 'round-container')
    })
    roundContainer.addEventListener('dragover', (e) => {
      e.preventDefault()
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'move'
      }
    })
    if (target) {
      target.addEventListener('drop', (e): void => {
        this.dropHandler(e, 'line-container')
      })
      target.addEventListener('dragover', (e) => {
        e.preventDefault()
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'move'
        }
      })
    }
  }

  /*  confirm = () => {
    this.toast.show(`Are you sure you want to logout, ${this.user}?`)
  } */

  /* logout = () => {
    localStorage.removeItem('catPuzzleUser')
    localStorage.removeItem('catPuzzleUserData')
    if (this.gameArea && this.header) {
      this.gameArea.remove()
      this.header.remove()
    }

    showLoader()

    setTimeout(() => {
      new Validation()
    }, 700)
  }
*/
  verifyChildrenLength() {
    if (this.roundContainer && this.continueButton && this.autoCompleteButton) {
      if (
        allChildrenHaveClass(this.roundContainer, 'temp-el') ||
        this.roundContainer.children.length === 0
      ) {
        unableButton(this.continueButton, 'disabled2', 'continue')
        unableButton(this.autoCompleteButton, 'disabled2', 'continue')
        this.continueButton.textContent = 'Check'
      } else {
        disableButton(this.continueButton, 'disabled2', 'continue')
        this.continueButton.textContent = 'Check'
      }
    }
  }

  createTemp(elWidth: string, elHeight: string): HTMLElement {
    const tempEl = createElement('div', 'temp-el')
    tempEl.style.width = elWidth
    tempEl.style.height = elHeight
    tempEl.addEventListener('dragstart', (e) => {
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
          const lineData = draggableElement.dataset.line
          if (dropzone.parentNode && state.lineNumber === Number(lineData)) {
            const dragWidth = draggableElement.style.width
            insertElBeforeDropzoneAndRemoveDuplicate(
              dropzone.parentNode,
              dragWidth,
              draggableElement,
              dropzone
            )

            this.verifyChildrenLength()
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
    let isOrderCorrect = true

    if (this.roundContainer) {
      const childrenArray1 = Array.from(this.roundContainer.children)
      if (
        this.roundContainer.children.length > 0 &&
        childrenArray1.every((child) => !child.classList.contains('temp-el'))
      ) {
        isOrderCorrect = false
        button.textContent = 'Check'
        button.classList.add('disabled2')
        target.style.border = '2px solid red'
        if (this.audio) {
          this.audio.src = 'error.mp3'
          this.audio.play()
        }
        return
      }
      const childrenArray = Array.from(target.children)
      const idsAfterDash = childrenArray.map((el) => {
        const { id } = el
        const parts = id.split('-')
        return Number.parseInt(parts[1], 10)
      })

      for (let i = 0; i < idsAfterDash.length - 1; i += 1) {
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
          // TODO подсветить ошибки
        }
      }

      if (isOrderCorrect && this.autoCompleteButton) {
        button.textContent = 'Continue'
        unableButton(button, 'disabled2', 'continue')
        disableButton(this.autoCompleteButton, 'disabled2', 'continue')
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
        if (state.lineNumber === 10) {
          this.roundArrays?.forEach((el) => {
            el.forEach((item) => {
              item.style.border = '0px solid rgba(0, 0, 0, 0)'
              item.style.boxShadow = '0px 0px 0px rgba(0, 0, 0, 0)'
              item.textContent = ''
            })
          })
          this.picture?.classList.add('win')
          if (this.userStats) {
            const key = state.lineNumber.toString()

            this.userStats.stats[key] = state.autocomplete

            state.autocomplete = false
          }
          if (this.autoCompleteButton && this.audioElement && this.catElement) {
            this.autoCompleteButton.textContent = 'Results'
            unableButton(this.autoCompleteButton, 'disabled2', 'continue')
            this.audioElement.style.display = 'none'
            this.catElement.style.display = 'inline-block'
          }
          if (this.roundContainer && this.level && this.translationContainer) {
            this.translationContainer.style.visibility = 'visible'
            this.translationContainer.textContent = `${
              this.level.transformedData[state.round - 1].name
            }, ${this.level.transformedData[state.round - 1].author}, ${
              this.level.transformedData[state.round - 1].year
            }`
          }
          target.style.border = ''
        }
      }
    }
  }

  continue = (lineNumber: number, round: number, level: number): void => {
    if (lineNumber <= 9) {
      if (this.userStats) {
        const key = state.lineNumber.toString()
        this.userStats.stats[key] = state.autocomplete
        state.autocomplete = false
      }
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
      if (this.header.roundSelect) {
        changeOptionColor(this.header.roundSelect, state.round)
      }

      state.round += 1
      state.lineNumber = 1

      this.autoCompleteButton.textContent = 'Help me'
      this.updateRound()
    } else if (round === state.roundsCount && level <= 5) {
      if (this.header.roundSelect) {
        changeOptionColor(this.header.roundSelect, state.round)
      }
      if (this.header.levelSelect) {
        changeOptionColor(this.header.levelSelect, state.level)
      }
      state.level += 1
      state.round = 1
      this.updateLevel()
    } else {
      if (this.header.roundSelect) {
        changeOptionColor(this.header.roundSelect, state.round)
      }
      if (this.header.levelSelect) {
        changeOptionColor(this.header.levelSelect, state.level)
      }
      state.level = 1
      this.updateLevel()
    }
  }

  backgroundTipOn = (): void => {
    const selector = `[data-line ="${state.lineNumber}"]:not(.line-container)`
    const target1 = Array.from(document.querySelectorAll(selector))

    const childrenArray = target1

    if (this.header.backgroundTip instanceof HTMLImageElement) {
      if (state.backgroundTip) {
        this.header.backgroundTip.src = 'backgroundTipDis.png'
        state.backgroundTip = false
        childrenArray.forEach((child) => {
          if (
            child instanceof HTMLElement &&
            !child.classList.contains('temp-el')
          ) {
            child.style.backgroundImage = 'url("brown-background.jpg")'
          }
        })
      } else {
        this.header.backgroundTip.src = 'backgroundTip1.png'
        state.backgroundTip = true
        childrenArray.forEach((child) => {
          if (
            child instanceof HTMLElement &&
            !child.classList.contains('temp-el')
          ) {
            child.style.backgroundImage = state.backgroundUrl
          }
        })
      }
    }
  }

  audioTipOn = (): void => {
    if (
      this.audioElement &&
      this.header.audioTip instanceof HTMLImageElement &&
      this.catElement instanceof HTMLImageElement
    ) {
      if (state.audioTip) {
        this.audioElement.style.display = 'none'
        this.catElement.style.display = 'inline-block'
        state.audioTip = false
        this.header.audioTip.src = 'audioTipDis.png'
      } else if (!state.audioTip) {
        this.audioElement.style.display = 'inline-block'
        this.catElement.style.display = 'none'
        this.header.audioTip.src = 'audioTip1.png'
        state.audioTip = true
      }
    }
  }

  translationTipOn = (): void => {
    if (
      this.translationContainer &&
      this.header.translationTip instanceof HTMLImageElement
    ) {
      if (this.translationContainer.style.visibility === 'hidden') {
        this.translationContainer.style.visibility = 'visible'
        this.header.translationTip.src = 'translationTip1.png'
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
    this.header.createRoundSelect()
  }

  updateLine(): void {
    if (state.lineNumber === 11) state.lineNumber = 1
    if (
      this.translationContainer &&
      this.level &&
      this.continueButton &&
      this.autoCompleteButton &&
      this.audio
    ) {
      state.audioSrc = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/${this.level.transformedData[state.round - 1].audioSrc[state.lineNumber - 1]}`
      // `${this.level.transformedData[state.round - 1].audioSrc[state.lineNumber - 1]}`

      this.audio.src = state.audioSrc
      state.translation = `${this.level.transformedData[state.round - 1].translation[state.lineNumber - 1]}`
      this.translationContainer.textContent = state.translation
      this.continueButton.classList.add('disabled2')
      this.continueButton.classList.remove('continue')
      this.autoCompleteButton.classList.remove('disabled2')
      this.autoCompleteButton.classList.add('continue')
      this.autoCompleteButton.textContent = 'Help me'
      this.continueButton.textContent = 'Check'
    }

    if (this.roundArrays && this.roundContainer && this.continueButton) {
      this.startGame(this.roundArrays, this.roundContainer, state.lineNumber)

      const target = document.getElementById(state.lineNumber.toString())
      if (target) {
        target.style.border = ''
      }
    }
    if (
      this.header.backgroundTip &&
      this.header.backgroundTip instanceof HTMLImageElement
    ) {
      this.header.backgroundTip.src = 'backgroundTip1.png'
    }
    if (
      this.header.translationTip &&
      this.header.translationTip instanceof HTMLImageElement &&
      this.translationContainer
    ) {
      this.header.translationTip.src = 'translationTip1.png'
      this.translationContainer.style.visibility = 'visible'
    }
    this.userData.lineNumber = state.lineNumber
    this.saveUserData()
    this.userData.autocomplete = false
  }

  updateRound(): void {
    if (this.level) {
      this.roundArrays = []

      state.backgroundUrl = `url('https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${this.level.transformedData[state.round - 1].imageSRC}')`
      // `url("/${this.level.transformedData[state.round - 1].imageSRC}")`

      this.array = this.level.transformedData[state.round - 1].words
      if (this.roundContainer && this.picture) {
        this.picture.innerHTML = ''
        this.picture.style.background = `linear-gradient(black, black), ${state.backgroundUrl}`
        this.picture.style.backgroundBlendMode = 'saturation'
        createImagePieces(
          this.picture,
          this.roundArrays,
          this.array,
          state.backgroundUrl
        )

        this.updateLine()
      }
      if (this.header.roundSelect)
        this.header.roundSelect.value = `${state.round}`
    }
    if (this.header.levelSelect) {
      this.header.levelSelect.value = `${state.level}`
    }
    if (this.audio) {
      if (state.isPlaying) {
        this.audio.pause()
      }
      this.audio.src = 'newround2.mp3'
      this.audio.play()
    }
    this.userData.round = state.round
    this.saveUserData()
    if (this.audioElement && this.catElement) {
      this.audioElement.style.display = 'inline-block'
      this.catElement.style.display = 'none'
    }
  }

  async updateLevel() {
    await this.useLevelData()
    this.updateRound()

    if (this.audio) {
      if (state.isPlaying === true) {
        this.audio.pause()
      }
      state.isPlaying = true
      const newTrack = 'newlevel.mp3'
      this.audio.src = newTrack
      this.audio.play()
      state.isPlaying = false
    }

    this.userData.level = state.level
    this.saveUserData()
  }

  roundSelect = () => {
    if (this.header.roundSelect) {
      state.round = Number(this.header.roundSelect.value)
      state.lineNumber = 1
      this.userData.round = state.round
      this.userData.lineNumber = state.lineNumber
      this.saveUserData()
      this.updateRound()
    }
  }

  levelSelect = () => {
    if (this.header.levelSelect) {
      state.level = Number(this.header.levelSelect.value)
      state.round = 1
      state.lineNumber = 1
      this.userData.level = state.level
      this.userData.round = state.round
      this.userData.lineNumber = state.lineNumber
      this.saveUserData()
      this.updateLevel()
    }
  }

  async getSavedUserData() {
    const savedUserData = localStorage.getItem('catPuzzleUserData')
    if (savedUserData) {
      this.userData = JSON.parse(savedUserData) as UserData
      state.level = this.userData.level
      state.round = this.userData.round

      state.lineNumber = this.userData.lineNumber

      await this.init()
    }
  }

  saveUserData() {
    localStorage.setItem('catPuzzleUserData', JSON.stringify(this.userData))
  }

  handleElClick(
    el: HTMLElement,
    source: HTMLElement,
    target: HTMLElement,
    direction: number
  ) {
    if (
      target.children.length === 0 ||
      allChildrenHaveClass(target, 'temp-el')
    ) {
      // если строка, куда переношу эл, заполнена только временными элементами
      target.innerHTML = ''
    }
    const elWidth = el.style.width
    const elHeight = el.style.height
    const tempEl = this.createTemp(elWidth, elHeight)
    source.append(tempEl)
    source.insertBefore(tempEl, el)
    insertElBeforeTempEl(target, elWidth, el)
    el.style.top = `${Number.parseInt(el.style.height, 10) * (10 - state.lineNumber + 1) * direction}px`
    el.getBoundingClientRect()
    el.style.top = '0px'
  }

  dropHandler(e: DragEvent, className: string) {
    e.preventDefault()
    if (e.dataTransfer && e.target && e.target instanceof HTMLElement) {
      const id = e.dataTransfer.getData('text')
      const draggableElement = document.getElementById(id)
      const dropzone = e.target

      if (
        draggableElement &&
        dropzone &&
        draggableElement.parentElement &&
        dropzone.parentElement
      ) {
        const lineData = draggableElement.dataset.line
        if (
          dropzone.classList.contains(className) &&
          state.lineNumber === Number(lineData) //  если это правильная строка
        ) {
          dropzone.append(draggableElement)
          this.verifyChildrenLength()
        }
      }
    }
  }
}
