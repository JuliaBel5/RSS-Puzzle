import { state } from '../main'
import { createElement } from '../utils/createElement'
type HandlerFunction = () => void

export class Header {
  element: HTMLElement
  logout: HTMLDivElement | undefined
  header: HTMLElement
  backgroundTip: HTMLElement | undefined
  audioTip: HTMLElement | undefined
  translationTip: HTMLElement | undefined
  levelSelect: HTMLSelectElement | undefined
  roundSelect: HTMLSelectElement | undefined

  constructor(element: HTMLElement) {
    this.element = element
    this.header = createElement('header', 'header')
  }

  init(): void {
    //first container for the selects
    const selectContainer = createElement('div', 'select-container')
    const levelSelectLabel = createElement('div', 'label', 'Level:')
    const roundSelectLabel = createElement('div', 'label', 'Round:')
    // select for game levels
    this.levelSelect = createElement('select', 'level-select')
    for (let i = 1; i <= 6; i++) {
      const option = createElement('option', '', `${i}`, `level-${i}`)
      option.value = i.toString()
      this.levelSelect.appendChild(option)
    }
    this.levelSelect.value = `${state.level}`
    // select for rounds
    this.roundSelect = createElement('select', 'round-select')
    for (let i = 1; i <= 46; i++) {
      const option = createElement('option', '', `${i}`, `round-${i}`)
      option.value = i.toString()
      this.roundSelect.appendChild(option)
    }

    this.roundSelect.value = `${state.round}`
    selectContainer.append(levelSelectLabel, this.levelSelect, roundSelectLabel, this.roundSelect)

    // second container for the icons
    const iconContainer = createElement('div', 'icon-container')
    const icons: HTMLElement[] = []
    const tipIcons = [
      { id: 'backgroundTip', label: 'Background Tip' },
      { id: 'audioTip', label: 'Audio Tip' },
      { id: 'translationTip', label: 'Translation Tip' },
    ]
    tipIcons.forEach((icon) => {
      const iconElement = createElement('img', icon.id, '', icon.id)
      iconElement.src = `${icon.id}1.png`
      iconElement.alt = `${icon.label}`
      icons.push(iconElement)
      iconContainer.append(iconElement)
    })

    this.backgroundTip = icons[0]
    this.translationTip = icons[2]
    this.audioTip = icons[1]
    if (this.backgroundTip instanceof HTMLImageElement && this.translationTip instanceof HTMLImageElement) {
    this.backgroundTip.src = 'backgroundTip1.png'
    this.translationTip.src = 'translationTip1.png'
  }
    this.logout = createElement('div', 'logout')

    iconContainer.append(this.logout)
    this.header.append(selectContainer, iconContainer)
    this.element.appendChild(this.header)
  }

  initStart() {
    this.logout = createElement('div', 'logout')
    const iconContainer = createElement('div', 'icon-container')
    this.header.style.justifyContent = 'end'
    iconContainer.append(this.logout)
    this.header.append(iconContainer)
    this.element.appendChild(this.header)
  }

  bindLogout = (handler: HandlerFunction): void => {
    if (this.logout) {
      this.logout.addEventListener('click', () => {
        handler()
      })
    }
  }

  remove() {
    if (this.header) {
      this.header.remove()
    }
  }
  bindBackgroundTipOn = (handler: HandlerFunction): void => {
    if (this.backgroundTip) {
      this.backgroundTip.addEventListener('click', () => {
        handler()
      })
    }
  }

  bindAudioTipOn = (handler: HandlerFunction): void => {
    if (this.audioTip) {
      this.audioTip.addEventListener('click', () => {
        handler()
      })
    }
  }
  bindTranslationTipOn = (handler: HandlerFunction): void => {
    if (this.translationTip) {
      this.translationTip.addEventListener('click', () => {
        handler()
      })
    }
  }

  bindRoundSelect = (handler: HandlerFunction): void => {
    if (this.roundSelect) {
      this.roundSelect.addEventListener('change', () => {
        handler()
      })
    }
  }

  bindLevelSelect = (handler: HandlerFunction): void => {
    if (this.levelSelect) {
      this.levelSelect.addEventListener('change', () => {
        handler()
      })
    }
  }
}
