import { createElement } from './createElement'

export function allChildrenHaveClass(
  container: HTMLElement,
  className: string
): boolean {
  for (let i = 0; i < container.children.length; i += 1) {
    if (!container.children[i].classList.contains(className)) {
      return false
    }
  }
  return true
}

export function adjustAfterElementBackgroundPosition(
  parentElement: HTMLElement,
  parentWidth: string,
  parentHeight: string,
  parentX: number,
  parentY: number,
  parentBackgroundImage: string
) {
  const newXPosition = `${parentX + parseInt(parentWidth, 10)}px`

  const afterElem = createElement('div', `image-piece-after`)
  afterElem.style.top = `calc(50% - 12px)`
  const newYPosition = `${parentY + parseInt(parentHeight, 10) / 2 - 12}px`
  afterElem.style.backgroundImage = `${parentBackgroundImage}`
  afterElem.style.backgroundPosition = `-${newXPosition} -${newYPosition}`
  afterElem.style.right = `-12px`
  afterElem.style.zIndex = `100`

  parentElement.append(afterElem)
}

export function verifyChildrenLength() {
  const roundContainer = document.querySelector('#round-container')
  if (roundContainer instanceof HTMLElement) {
    if (
      allChildrenHaveClass(roundContainer, 'temp-el') ||
      roundContainer.children.length === 0
    ) {
      const lineIsCompleted = new CustomEvent('lineIsCompleted')
      document.dispatchEvent(lineIsCompleted)
    } else {
      const lineIsNotCompleted = new CustomEvent('lineIsNotCompleted')
      document.dispatchEvent(lineIsNotCompleted)
    }
  }
}

export function disableButton(
  button: HTMLElement,
  classDis: string,
  classAct: string
) {
  button.classList.remove(classAct)
  button.classList.add(classDis)
}
export function unableButton(
  button: HTMLElement,
  classDis: string,
  classAct: string
) {
  button.classList.remove(classDis)
  button.classList.add(classAct)
}

export function insertElBeforeDropzoneAndRemoveDuplicate(
  container: HTMLElement | ParentNode,
  elWidth: string,
  el: HTMLElement,
  dropzone: HTMLElement
) {
  container.insertBefore(el, dropzone) // ошибка
  const tempWidth = dropzone.style.width
  if (dropzone.classList.contains('temp-el')) {
    dropzone.remove()
  }

  for (let i = 0; i < container.children.length; i += 1) {
    const child = container.children[i]
    if (
      child instanceof HTMLElement &&
      child.style.width === elWidth &&
      child.classList.contains('temp-el')
    ) {
      child.style.width = tempWidth

      i -= 1
      break
    }
  }
}

export function insertElAfterDropzoneAndRemoveDuplicate(
  container: HTMLElement | ParentNode,
  elWidth: string,
  el: HTMLElement,
  dropzone: HTMLElement
) {
  container.insertBefore(el, dropzone.nextSibling)

  for (let i = 0; i < container.children.length; i += 1) {
    const child = container.children[i]
    if (
      child instanceof HTMLElement &&
      child.style.width === elWidth &&
      child.classList.contains('temp-el')
    ) {
      child.remove()
      i -= 1

      break
    }
  }
}

export function insertElBeforeTempEl(
  container: HTMLElement | ParentNode,
  elWidth: string,
  el: HTMLElement
) {
  if (container.children.length > 0) {
    for (let i = 0; i < container.children.length; i += 1) {
      const child = container.children[i]
      if (child instanceof HTMLElement) {
        if (child.classList.contains('temp-el')) {
          container.insertBefore(el, child)

          const tempElWidth = child.style.width
          child.remove()
          for (let j = 0; j < container.children.length; j += 1) {
            const child1 = container.children[j]
            if (child1 instanceof HTMLElement) {
              if (
                child1.classList.contains('temp-el') &&
                child1.style.width === elWidth
              ) {
                child1.style.width = tempElWidth
              }
            }
          }
          break
        } else {
          container.append(el)
        }
      }
    }
  } else {
    container.append(el)
  }
}

export function insertElAfterTempEl(
  container: HTMLElement | ParentNode,
  elWidth: string,
  el: HTMLElement
) {
  for (let i = 0; i < container.children.length; i += 1) {
    const child = container.children[i]
    if (child instanceof HTMLElement) {
      if (child.classList.contains('temp-el')) {
        container.insertBefore(el, child.nextSibling)

        const tempElWidth = child.style.width
        child.remove()
        for (let j = 0; j < container.children.length; j += 1) {
          const child1 = container.children[j]
          if (
            child1 instanceof HTMLElement &&
            child1.style.width === elWidth &&
            child1.classList.contains('temp-el')
          ) {
            child1.style.width = tempElWidth
          }
        }
        break
      } else {
        container.append(el)
      }
    }
  }
}
