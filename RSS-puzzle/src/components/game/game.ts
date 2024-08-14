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
import { changeOptionColor } from '../header'
import { LevelDataResult, transformLevelData } from '../levels'
import { Stats } from '../stats'
import { UserData, UserStats } from './types'
import { Music } from '../../utils/Music'
import { GameView } from './gameView'

export class Game {
  user: string
  roundArrays: HTMLElement[][] | undefined

  level: LevelDataResult | undefined

  array: ImagePieceData[] | undefined

  continueButton: HTMLButtonElement | undefined

  audio: Music | undefined

  userData: UserData

  stats: Stats | undefined

  userStats: UserStats | undefined

  gameView: GameView = new GameView()
  containerArr: HTMLElement[] | undefined

  constructor(user: string) {
    this.user = user
    this.stats = new Stats(this.gameView.gameArea)
    document.body.append(this.gameView.gameArea)

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
    this.array = []
    this.roundArrays = []
    if (this.level) {
      this.setLevelData()

      if (
        (this.gameView.picture,
        this.gameView.roundContainer)
      ) {
       this.containerArr = createImagePieces(
          this.gameView.picture,
          this.roundArrays,
          this.array,
          state.backgroundUrl
        )
        this.startGame(
          this.roundArrays,
          this.gameView.roundContainer,
          state.lineNumber
        )
        this.setBinds()
      }
     
    }

    this.setMediaQueries()
    this.setEventListeners()
  }

  private startGame = (
    roundArrays: HTMLElement[][],
    roundContainer: HTMLElement | undefined,
    lineNumber: number
  ) => {
    if (roundContainer) {
      roundContainer.innerHTML = ''

   if (!this.containerArr) {
    return
   }
    const target = this.containerArr[state.lineNumber - 1]
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
        this.setElBackground(num)
      })
      const shuffledGameIndArr = shuffleAndCheck(gameArrIndexes)
      shuffledGameIndArr.forEach((item) => {
        if (target) {
          target.style.display = 'flex'
          const el = roundArrays[lineNumber - 1][item]
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
  }

  verifyChildrenLength() {
    if (
      this.gameView.roundContainer &&
      this.gameView.continueButton &&
      this.gameView.autoCompleteButton
    ) {
      if (
        allChildrenHaveClass(this.gameView.roundContainer, 'temp-el') ||
        this.gameView.roundContainer.children.length === 0
      ) {
        unableButton(this.gameView.continueButton, 'disabled2', 'continue')
        unableButton(this.gameView.autoCompleteButton, 'disabled2', 'continue')
        this.gameView.continueButton.textContent = 'Check'
      } else {
        disableButton(this.gameView.continueButton, 'disabled2', 'continue')
        this.gameView.continueButton.textContent = 'Check'
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

    if (this.gameView.roundContainer) {
      const childrenArray1 = Array.from(this.gameView.roundContainer.children)
      if (
        this.gameView.roundContainer.children.length > 0 &&
        childrenArray1.every((child) => !child.classList.contains('temp-el'))
      ) {
        isOrderCorrect = false
        button.textContent = 'Check'
        button.classList.add('disabled2')
        target.style.border = '2px solid red'
        if (this.gameView.audio) {
          this.gameView.audio.play('error.mp3')
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
          if (this.gameView.audio) {
            this.gameView.audio.play('error.mp3')
          }
          break
          // TODO подсветить ошибки
        }
      }

      if (isOrderCorrect && this.gameView.autoCompleteButton) {
        button.textContent = 'Continue'
        unableButton(button, 'disabled2', 'continue')
        disableButton(this.gameView.autoCompleteButton, 'disabled2', 'continue')
        target.style.border = '2px solid green'
        childrenArray.forEach((child) => {
          if (child instanceof HTMLElement) {
               child.style.backgroundImage = state.backgroundUrl;
               const singleChild = child.firstElementChild;
             if (singleChild instanceof HTMLElement) {
                singleChild.style.backgroundImage = state.backgroundUrl;
             }
          }
         });
        if (this.gameView.audio) {
          this.gameView.audio.play('solution.wav')
        }
        if (state.lineNumber === 10) {
          this.roundArrays?.forEach((el) => {
            el.forEach((item) => {
              item.style.border = '0px solid rgba(0, 0, 0, 0)'
              item.style.boxShadow = '0px 0px 0px rgba(0, 0, 0, 0)'
              item.textContent = ''
            })
          })
          this.gameView.picture?.classList.add('win')
          if (this.userStats) {
            const key = state.lineNumber.toString()

            this.userStats.stats[key] = state.autocomplete

            state.autocomplete = false
          }
          if (
            this.gameView.autoCompleteButton &&
            this.gameView.audioElement &&
            this.gameView.catElement
          ) {
            this.gameView.autoCompleteButton.textContent = 'Results'
            unableButton(
              this.gameView.autoCompleteButton,
              'disabled2',
              'continue'
            )
            this.gameView.audioElement.style.display = 'none'
            this.gameView.catElement.style.display = 'inline-block'
          }
          if (
            this.gameView.roundContainer &&
            this.level &&
            this.gameView.translationContainer
          ) {
            this.gameView.translationContainer.style.visibility = 'visible'
            this.gameView.translationContainer.textContent = `${
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
      if (this.gameView.audio) {
        this.gameView.audio.play('Collapse.mp3')
      }
    } else if (
      lineNumber > 9 &&
      round < state.roundsCount &&
      this.gameView.autoCompleteButton &&
      this.level
    ) {
      if (this.gameView.header.roundSelect) {
        changeOptionColor(this.gameView.header.roundSelect, state.round)
      }
      state.round += 1
      state.lineNumber = 1
      this.gameView.autoCompleteButton.textContent = 'Help me'
      this.updateRound()
    } else if (round === state.roundsCount && level <= 5) {
      if (
        this.gameView.header.roundSelect &&
        this.gameView.header.levelSelect
      ) {
        changeOptionColor(this.gameView.header.roundSelect, state.round)
        changeOptionColor(this.gameView.header.levelSelect, state.level)
      }
      state.level += 1
      state.round = 1
      this.updateLevel()
    } else {
      if (
        this.gameView.header.roundSelect &&
        this.gameView.header.levelSelect
      ) {
        changeOptionColor(this.gameView.header.roundSelect, state.round)
        changeOptionColor(this.gameView.header.levelSelect, state.level)
      }
      state.level = 1
      this.updateLevel()
    }
  }

  backgroundTipOn = (): void => {
      if (!this.gameView.game || !this.containerArr || !this.gameView.roundContainer) {
      return
    }
   // const selector = `[data-line ="${state.lineNumber}"]:not(.line-container)`
 //   const target2 = Array.from(this.gameView.game.querySelectorAll(selector))
 const piecesFromResultLine = Array.from(this.containerArr[state.lineNumber - 1].children)
 const piecesFromRoundLine = Array.from(this.gameView.roundContainer.children)
    const target = piecesFromResultLine.concat(piecesFromRoundLine)
        
    if (this.gameView.header.backgroundTip instanceof HTMLImageElement) {
      if (state.backgroundTip) {
        this.gameView.header.backgroundTip.src = 'backgroundTipDis.png'
        state.backgroundTip = false
        this.changeElBackground(target, '') //'url("brown-background.jpg")'
       
      } else {
        this.gameView.header.backgroundTip.src = 'backgroundTip1.png'
        state.backgroundTip = true
        this.changeElBackground(target, state.backgroundUrl)
       
      }
    }
  }

  audioTipOn = (): void => {
    if (
      this.gameView.audioElement &&
      this.gameView.header.audioTip instanceof HTMLImageElement &&
      this.gameView.catElement instanceof HTMLImageElement
    ) {
      if (state.audioTip) {
        this.gameView.audioElement.style.display = 'none'
        this.gameView.catElement.style.display = 'inline-block'
        state.audioTip = false
        this.gameView.header.audioTip.src = 'audioTipDis.png'
      } else if (!state.audioTip) {
        this.gameView.audioElement.style.display = 'inline-block'
        this.gameView.catElement.style.display = 'none'
        this.gameView.header.audioTip.src = 'audioTip1.png'
        state.audioTip = true
      }
    }
  }

  translationTipOn = (): void => {
    if (
      this.gameView.translationContainer &&
      this.gameView.header.translationTip instanceof HTMLImageElement
    ) {
      if (this.gameView.translationContainer.style.visibility === 'hidden') {
        this.gameView.translationContainer.style.visibility = 'visible'
        this.gameView.header.translationTip.src = 'translationTip1.png'
      } else {
        this.gameView.translationContainer.style.visibility = 'hidden'
        this.gameView.header.translationTip.src = 'translationTipDis.png'
      }
    }
  }

  async useLevelData() {
    const useLevelData = await transformLevelData(state.level)
    this.level = useLevelData
    state.roundsCount = this.level.roundsCount
    this.gameView.header.createRoundSelect()
  }

  updateLine(): void {
    if (state.lineNumber === 11) state.lineNumber = 1
    if (
      this.gameView.translationContainer &&
      this.level &&
      this.gameView.continueButton &&
      this.gameView.autoCompleteButton &&
      this.gameView.audio
    ) {
      state.audioSrc = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/${this.level.transformedData[state.round - 1].audioSrc[state.lineNumber - 1]}`
      // `${this.level.transformedData[state.round - 1].audioSrc[state.lineNumber - 1]}`
      this.gameView.audio.path = state.audioSrc
      state.translation = `${this.level.transformedData[state.round - 1].translation[state.lineNumber - 1]}`
      this.gameView.translationContainer.textContent = state.translation
      disableButton(this.gameView.continueButton, 'disabled2', 'continue')
      unableButton(this.gameView.autoCompleteButton, 'disabled2', 'continue')
      this.gameView.autoCompleteButton.textContent = 'Help me'
      this.gameView.continueButton.textContent = 'Check'
    }
    if (
      this.roundArrays &&
      this.gameView.roundContainer &&
      this.gameView.continueButton
    ) {
      this.startGame(
        this.roundArrays,
        this.gameView.roundContainer,
        state.lineNumber
      )
     if (!this.containerArr) {
      return
     }
      const target = this.containerArr[state.lineNumber - 1]
      if (target) {
        target.style.border = ''
      }
    }
    if (this.gameView.header.backgroundTip instanceof HTMLImageElement) {
      this.gameView.header.backgroundTip.src = 'backgroundTip1.png'
    }
    if (
      this.gameView.header.translationTip instanceof HTMLImageElement &&
      this.gameView.translationContainer
    ) {
      this.gameView.header.translationTip.src = 'translationTip1.png'
      this.gameView.translationContainer.style.visibility = 'visible'
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
      if (this.gameView.roundContainer && this.gameView.picture) {
        this.gameView.picture.innerHTML = ''
        this.gameView.picture.style.background = `linear-gradient(black, black), ${state.backgroundUrl}`
        this.gameView.picture.style.backgroundBlendMode = 'saturation'
        this.containerArr = createImagePieces(
          this.gameView.picture,
          this.roundArrays,
          this.array,
          state.backgroundUrl
        )
        this.updateLine()
      }
      if (this.gameView.header.roundSelect)
        this.gameView.header.roundSelect.value = `${state.round}`
    }
    if (this.gameView.header.levelSelect) {
      this.gameView.header.levelSelect.value = `${state.level}`
    }
    if (this.gameView.audio) {
      if (state.isPlaying) {
        this.gameView.audio.stop()
      }
      this.gameView.audio.play('newround2.mp3')
    }
    this.userData.round = state.round
    this.saveUserData()
    if (this.gameView.audioElement && this.gameView.catElement) {
      this.gameView.audioElement.style.display = 'inline-block'
      this.gameView.catElement.style.display = 'none'
    }
  }

  async updateLevel() {
    await this.useLevelData()
    this.updateRound()

    if (this.gameView.audio) {
      if (state.isPlaying === true) {
        this.gameView.audio.stop()
      }
      state.isPlaying = true
      this.gameView.audio.play('newlevel.mp3')
      state.isPlaying = false
    }

    this.userData.level = state.level
    this.saveUserData()
  }

  roundSelect = () => {
    if (this.gameView.header.roundSelect) {
      state.round = Number(this.gameView.header.roundSelect.value)
      state.lineNumber = 1
      this.userData.round = state.round
      this.userData.lineNumber = state.lineNumber
      this.saveUserData()
      this.updateRound()
    }
  }

  levelSelect = () => {
    if (this.gameView.header.levelSelect) {
      state.level = Number(this.gameView.header.levelSelect.value)
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
  renderStatsInfo() {
    if (this.userStats && this.stats && this.gameView.audio) {
      const statsContent = `${this.userStats.name}, ${this.userStats.author}, ${this.userStats.year}`
      this.gameView.audio.play('stats.mp3')
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
  continueButtonClickHandler = () => {
    if (!this.containerArr) {
      return
     }
    const target = this.containerArr[state.lineNumber - 1]
    if (target && this.gameView.continueButton) {
      if (this.gameView.continueButton.textContent === 'Check') {
        this.verifyLine(target, this.gameView.continueButton)
      } else if (this.gameView.continueButton.textContent === 'Continue') {
        this.continue(state.lineNumber, state.round, state.level)
      }
    }
  }
  autocompleteButtonClickHandler = () => {
    if (this.gameView.autoCompleteButton?.textContent === 'Help me') {
     if (!this.containerArr || !this.gameView.roundContainer) {
      return
     }
      const target = this.containerArr[state.lineNumber - 1]
   //  const selector = `[data-line ="${state.lineNumber}"]:not(.line-container)`
    //  const children = Array.from(document.querySelectorAll(selector))
      const piecesFromResultLine = Array.from(this.containerArr[state.lineNumber - 1].children)
      const piecesFromRoundLine = Array.from(this.gameView.roundContainer.children)
    const children = piecesFromResultLine.concat(piecesFromRoundLine)
         if (target && this.gameView.continueButton) {
        // const elementsWithIds = Array.from(children).map((child) => {
          const elementsWithIds = children.map((child) => {
          if (!child.classList.contains('temp-el')) {
            return  { element: child,
          idNum: Number.parseInt(child.id.split('-')[1], 10)
        }
      }
    })
  
    elementsWithIds.sort((a, b) => {
      if (!a || !b) return 0; 
      return a.idNum - b.idNum;
     });

        target.innerHTML = ''
        unableButton(this.gameView.continueButton, 'disabled2', 'continue')
        disableButton(this.gameView.autoCompleteButton, 'disabled2', 'continue')
        elementsWithIds.forEach((item) => {
          if (item) { 
             target.append(item.element);
          }
         });
        if (this.gameView.audio) {
          this.gameView.audio.play('Bibip.mp3')
        }
        this.userData.autocomplete = true
        this.saveUserData()
        state.autocomplete = true
      }
    } else if (
      this.gameView.autoCompleteButton &&
      this.gameView.autoCompleteButton.textContent === 'Results'
    ) {
      this.renderStatsInfo()
    }
  }
  setMediaQueries = () => {
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
  }

  setEventListeners = () => {
    document.addEventListener('lineIsCompleted', () => {
      if (this.gameView.continueButton && this.gameView.autoCompleteButton) {
        unableButton(this.gameView.continueButton, 'disabled2', 'continue')
        unableButton(this.gameView.autoCompleteButton, 'disabled2', 'continue')
      }
    })

    document.addEventListener('lineIsNotCompleted', () => {
      if (this.gameView.continueButton && this.gameView.autoCompleteButton) {
        disableButton(this.gameView.continueButton, 'disabled2', 'continue')
      }
    })
  }
  setLevelData = () => {
    if (this.level) {
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
      this.array = this.level.transformedData[state.round - 1].words
      state.backgroundUrl = `url('https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/images/${this.level.transformedData[state.round - 1].imageSRC}')`
     // state.backgroundUrl = `url("/${this.level.transformedData[state.round - 1].imageSRC}")`
      state.audioSrc = `https://raw.githubusercontent.com/rolling-scopes-school/rss-puzzle-data/main/${this.level.transformedData[state.round - 1].audioSrc[state.lineNumber - 1]}`
       // state.audioSrc =`${this.level.transformedData[state.round - 1].audioSrc[state.lineNumber - 1]}`

      if (this.gameView.translationContainer) {
        this.gameView.translationContainer.textContent = `${this.level.transformedData[state.round - 1].translation[state.lineNumber - 1]}`
      }

      if (this.gameView.picture) {
        this.gameView.picture.style.background = `linear-gradient(black, black), ${state.backgroundUrl}`
        this.gameView.picture.style.backgroundBlendMode = 'saturation'
      }
    }
    if (this.gameView.header.levelSelect && this.gameView.header.roundSelect) {
      this.gameView.header.levelSelect.value = state.level.toString()
      this.gameView.header.roundSelect.value = state.round.toString()
    } 
  }

  setBinds = () => {
    this.gameView.bindAutocompleteButton(this.autocompleteButtonClickHandler)
    this.gameView.bindContinueButton(this.continueButtonClickHandler)
    this.gameView.header.bindTranslationTipOn(this.translationTipOn)
    this.gameView.header.bindAudioTipOn(this.audioTipOn)
    this.gameView.header.bindBackgroundTipOn(this.backgroundTipOn)
    this.gameView.header.bindRoundSelect(this.roundSelect)
    this.gameView.header.bindLevelSelect(this.levelSelect)
  }

  setElBackground = (num: number) => {
    const selector = `.line-container[data-line="${num}"]`
    const resultContainer = document.querySelector(selector)
    if (resultContainer instanceof HTMLElement) {
      resultContainer.style.display = 'flex'
      resultContainer.style.border = ''
      const childrenArray = Array.from(resultContainer.children)
      childrenArray.forEach((child) => {
        if (child instanceof HTMLElement) {
          child.style.backgroundImage = state.backgroundUrl
        }
      })
    }
  }

  changeElBackground = (target: Element[], image: string) => {
    target.forEach((child) => {
        if (child instanceof HTMLElement && !child.classList.contains('temp-el')) {
          if (image) {
            child.style.backgroundImage = image;
            const singleChild = child.firstElementChild;
            if (singleChild instanceof HTMLElement) {
                
                singleChild.style.backgroundImage = image;
            }
        } else {
          child.style.backgroundImage = image;
          child.style.backgroundColor = `rgb(114,102,90)`;
          const singleChild = child.firstElementChild;
          if (singleChild instanceof HTMLElement) {
             singleChild.style.backgroundImage = image;
             singleChild.style.backgroundColor = `rgb(114,102,90)`;
        }
      }
    }
    });
}
}
