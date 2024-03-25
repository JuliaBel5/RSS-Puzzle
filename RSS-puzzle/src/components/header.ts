// eslint-disable-next-line import/no-cycle
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

  catElement: HTMLImageElement | undefined

  audio: HTMLAudioElement

  constructor() {
    this.element = document.body
    this.header = createElement('header', 'header')
    this.audio = new Audio()
  }

  init(): void {
    // first container for the selects
    const selectContainer = createElement('div', 'select-container')
    const levelSelectLabel = createElement('div', 'label', 'Level:')
    const roundSelectLabel = createElement('div', 'label', 'Round:')
    // select for game levels
    this.levelSelect = createElement('select', 'level-select')
    for (let i = 1; i <= 6; i += 1) {
      const option = createElement('option', '', `${i}`, `level-${i}`)
      option.value = i.toString()
      this.levelSelect.append(option)
    }
    this.levelSelect.value = `${state.level}`
    this.levelSelect.addEventListener('click', () => {
      this.audio.src = 'clikclack.mp3'
      this.audio.play()
    })
    // select for rounds
    this.roundSelect = createElement('select', 'round-select')
    for (let i = 1; i <= 46; i += 1) {
      const option = createElement('option', '', `${i}`, `round-${i}`)
      option.value = i.toString()
      this.roundSelect.append(option)
    }

    this.roundSelect.value = `${state.round}`

    this.roundSelect.addEventListener('click', () => {
      this.audio.src = 'click.mp3'
      this.audio.play()
    })
    selectContainer.append(
      levelSelectLabel,
      this.levelSelect,
      roundSelectLabel,
      this.roundSelect,
    )

    this.catElement = createElement('img', 'mini-cat')
    this.catElement.src = 'cat7.png'
    this.catElement.style.display = 'inline-block'
    this.catElement.addEventListener('click', () => {
      if (this.audio) {
        this.audio.src = 'meow.mp3'
        this.audio.play()
      }
    })

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

    const [backgroundTip, audioTip, translationTip] = icons
    this.backgroundTip = backgroundTip
    this.audioTip = audioTip
    this.translationTip = translationTip

    if (
      this.backgroundTip instanceof HTMLImageElement &&
      this.translationTip instanceof HTMLImageElement
    ) {
      this.backgroundTip.src = 'backgroundTip1.png'
      this.translationTip.src = 'translationTip1.png'
    }
    this.logout = createElement('div', 'logout')
    this.logout.style.cursor = 'pointer'

    iconContainer.append(this.logout)
    this.header.append(selectContainer, this.catElement, iconContainer)
    this.element.append(this.header)
  }

  initStart() {
    this.catElement = createElement('img', 'mini-cat')
    this.catElement.src = 'cat5a.png'
    this.catElement.style.height = '100%'

    this.catElement.style.display = 'inline-block'
    this.catElement.addEventListener('click', () => {
      if (this.audio) {
        this.audio.src = 'meow.mp3'
        this.audio.play()
      }
    })
    this.logout = createElement('div', 'logout')
    this.logout.style.cursor = 'pointer'

    const iconContainer = createElement('div', 'icon-container')
    this.header.style.justifyContent = 'space-between'
    iconContainer.append(this.logout)
    this.header.append(this.catElement, iconContainer)
    this.element.append(this.header)
  }

  bindLogout = (handler: HandlerFunction): void => {
    if (this.logout && this.audio) {
      this.logout.addEventListener('click', () => {
        this.audio.src = 'meow6.mp3'
        this.audio.volume = 0.3
        this.audio.play()

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
    if (this.backgroundTip && this.audio) {
      this.backgroundTip.addEventListener('click', () => {
        this.audio.src = 'zviak.mp3'
        this.audio.play()
        handler()
      })
    }
  }

  bindAudioTipOn = (handler: HandlerFunction): void => {
    if (this.audioTip && this.audio) {
      this.audioTip.addEventListener('click', () => {
        this.audio.src = 'zviak2.mp3'
        this.audio.play()
        handler()
      })
    }
  }

  bindTranslationTipOn = (handler: HandlerFunction): void => {
    if (this.translationTip && this.audio) {
      this.translationTip.addEventListener('click', () => {
        this.audio.src = 'dzing.mp3'
        this.audio.play()
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

  createRoundSelect() {
    if (this.roundSelect) {
      this.roundSelect.innerHTML = ''
      for (let i = 1; i <= state.roundsCount; i += 1) {
        const option = createElement('option', '', `${i}`, `round-${i}`)
        option.value = i.toString()
        this.roundSelect.append(option)
      }
    }
  }
}

export function changeOptionColor(selectElement: HTMLSelectElement, i: number) {
  if (selectElement && selectElement.options) {
    const option = selectElement.options[i - 1]

    if (option.value === i.toString()) {
      option.style.backgroundColor = 'rgba(196,221,164, 0.5)'
    }
  }
}
