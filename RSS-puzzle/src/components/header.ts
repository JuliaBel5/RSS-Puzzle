import { createElement } from '../utils/createElement'
type HandlerFunction = () => void

export class Header {
  element: HTMLElement
  logout: HTMLDivElement | undefined
  header: HTMLElement

  constructor(element: HTMLElement) {
    this.element = element
    this.header = createElement('header', 'header')
  }

  init(): void {
    //first container for the selects
    const selectContainer = createElement('div', 'select-container')

    // select for game levels
    const levelSelect = createElement('select', 'level-select')
    for (let i = 1; i <= 6; i++) {
      const option = createElement('option', '', `${i}`, `level-${i}`)
      option.value = i.toString()
      levelSelect.appendChild(option)
    }

    // select for rounds
    const roundSelect = createElement('select', 'round-select')
    for (let i = 1; i <= 40; i++) {
      const option = createElement('option', '', `${i}`, `round-${i}`)
      option.value = i.toString()
      roundSelect.appendChild(option)
    }
    selectContainer.append(levelSelect, roundSelect)

    // second container for the icons
    const iconContainer = createElement('div', 'icon-container')
    const icons: HTMLElement[] = []
    const tipIcons = [
      { id: 'background-tip', label: 'Background Tip' },
      { id: 'audio-tip', label: 'Audio Tip' },
      { id: 'translation-tip', label: 'Translation Tip' },
    ]
    tipIcons.forEach((icon) => {
      const iconElement = createElement('img', icon.id, '', icon.id)
      iconElement.src = `${icon.id}.png`
      icons.push(iconElement)
      iconContainer.append(iconElement)
    })

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
}
