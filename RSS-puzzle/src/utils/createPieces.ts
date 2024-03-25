// eslint-disable-next-line import/no-cycle
import { state } from '../main'
import { createElement } from './createElement'

export function allChildrenHaveClass(
  container: HTMLElement,
  className: string,
): boolean {
  for (let i = 0; i < container.children.length; i += 1) {
    if (!container.children[i].classList.contains(className)) {
      return false
    }
  }
  return true
}

export function verifyChildrenLength() {
  const button = document.querySelector('#check')
  const autoCompleteButton = document.querySelector('#autocomplete')
  const roundContainer = document.querySelector('#round-container')
  if (roundContainer instanceof HTMLElement && button && autoCompleteButton) {
    if (
      allChildrenHaveClass(roundContainer, 'temp-el') ||
      roundContainer.children.length === 0
    ) {
      button.classList.remove('disabled2')
      button.classList.add('continue')
      autoCompleteButton.classList.remove('disabled2')
      autoCompleteButton.classList.add('continue')
    } else {
      button.classList.remove('continue')
      button.classList.add('disabled2')
      autoCompleteButton.classList.remove('continue')
      autoCompleteButton.classList.add('disabled2')
    }
  }
}

export function insertElBeforeDropzoneAndRemoveDuplicate(
  container: HTMLElement | ParentNode,
  elWidth: string,
  el: HTMLElement,
  dropzone: HTMLElement,
) {
  container.insertBefore(el, dropzone)
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
  dropzone: HTMLElement,
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

export function createImagePieces(
  container: HTMLElement,
  roundContainer: HTMLElement,
  roundArrays: HTMLElement[][],
  list: ImagePieceData[],
  backgroundImageUrl = 'brown-background.jpg',
) {
  let y = 0
  //  const minWidth = '50px'
  //  const maxWidth = '300px'
  const pictureElement = document.querySelector('.picture')
  if (pictureElement instanceof HTMLElement) {
    const pictureWidth = pictureElement.offsetWidth
    const pictureHeight = pictureElement.offsetHeight

    const fragment = document.createDocumentFragment()

    list.forEach((item, index) => {
      const lineNumber: number = index + 1
      const lineContainer = createElement(
        'div',
        'line-container',
        '',
        lineNumber.toString(),
      )
      lineContainer.style.position = 'absolute'
      lineContainer.setAttribute('draggable', 'true')
      lineContainer.dataset.line = lineNumber.toString()
      const lineArr: HTMLElement[] = []
      const totalLetters = item.letters.reduce(
        (acc, letters) => acc + letters.length,
        0,
      )
      const widthRatio = pictureWidth / totalLetters

      let x = 0

      for (let i = 0; i < item.letters.length; i += 1) {
        const piece = createElement('div', 'image-piece')

        piece.style.width = `${widthRatio * item.letters[i].length}px`
        piece.style.height = `${pictureHeight / 10}px`
        piece.style.backgroundPosition = `-${x}px -${y}px`
        piece.setAttribute('draggable', 'true')
        piece.setAttribute('id', `${index}-${i}`)
        piece.textContent = item.letters[i]
        piece.style.backgroundImage = `url(${backgroundImageUrl})`
        piece.dataset.line = lineNumber.toString()
        piece.setAttribute(
          'background-position',
          piece.style.backgroundPosition,
        )
        fragment.append(piece)
        // lineContainer.append(piece)

        piece.addEventListener('dragstart', (e) => {
          if (e.dataTransfer && e.target && e.target instanceof HTMLElement) {
            e.dataTransfer.setData('text', e.target.id)
          }
        })

        lineContainer.addEventListener('drop', (e): void => {
          e.preventDefault()
          if (e.dataTransfer && e.target && e.target instanceof HTMLElement) {
            const id = e.dataTransfer.getData('text')
            const draggableElement = document.getElementById(id)
            const dropzone = e.target
            // если это правильная строка
            if (
              draggableElement &&
              dropzone &&
              draggableElement.parentElement &&
              dropzone.parentElement
            ) {
              const dropzoneRect = dropzone.getBoundingClientRect()
              const dropzoneCenterY = dropzoneRect.top + dropzoneRect.height / 2
              const draggableElementRect =
                draggableElement.getBoundingClientRect()
              const draggableElementCenterY =
                draggableElementRect.top + draggableElementRect.height / 2
              const lineData = draggableElement.dataset.line
              const lineData1 = dropzone.dataset.line

              if (
                dropzone.classList.contains('line-container') &&
                state.lineNumber === Number(lineData)
              ) {
                dropzone.append(draggableElement)
                verifyChildrenLength()
              } else if (
                state.lineNumber === Number(lineData) &&
                lineData === lineData1 &&
                draggableElementCenterY < dropzoneCenterY
              ) {
                //  lineContainer.insertBefore(draggableElement, dropzone)
                insertElBeforeDropzoneAndRemoveDuplicate(
                  lineContainer,
                  draggableElement.style.width,
                  draggableElement,
                  dropzone,
                )
                verifyChildrenLength()
              } else if (
                state.lineNumber === Number(lineData) &&
                lineData === lineData1 &&
                draggableElementCenterY > dropzoneCenterY
              ) {
                /*  lineContainer.insertBefore(
                  draggableElement,
                  dropzone.nextSibling,
                ) */
                insertElAfterDropzoneAndRemoveDuplicate(
                  lineContainer,
                  draggableElement.style.width,
                  draggableElement,
                  dropzone,
                )
                verifyChildrenLength()
              }
            }
          }
        })
        roundContainer.addEventListener('drop', (e) => {
          e.preventDefault()
          if (e.dataTransfer && e.target && e.target instanceof HTMLElement) {
            const id = e.dataTransfer.getData('text')
            const draggableElement = document.getElementById(id)
            const dropzone = e.target
            if (draggableElement && draggableElement.parentElement) {
              const dropzoneRect = dropzone.getBoundingClientRect()
              const dropzoneCenterY = dropzoneRect.top + dropzoneRect.height / 2
              const draggableElementRect =
                draggableElement.getBoundingClientRect()
              const draggableElementCenterY =
                draggableElementRect.top + draggableElementRect.height / 2
              const lineData = draggableElement.dataset.line
              const lineData1 = dropzone.dataset.line

              if (
                state.lineNumber === Number(lineData) &&
                dropzone.classList.contains('round-container')
              ) {
                dropzone.append(draggableElement)
                verifyChildrenLength()
              } else if (
                state.lineNumber === Number(lineData) &&
                lineData === lineData1 &&
                draggableElementCenterY < dropzoneCenterY
              ) {
                //    lineContainer.insertBefore(draggableElement, dropzone)
                insertElBeforeDropzoneAndRemoveDuplicate(
                  lineContainer,
                  draggableElement.style.width,
                  draggableElement,
                  dropzone,
                )
                verifyChildrenLength()
              } else if (
                state.lineNumber === Number(lineData) &&
                lineData === lineData1 &&
                draggableElementCenterY > dropzoneCenterY
              ) {
                /*  lineContainer.insertBefore(
                  draggableElement,
                  dropzone.nextSibling,
                ) */
                insertElAfterDropzoneAndRemoveDuplicate(
                  lineContainer,
                  draggableElement.style.width,
                  draggableElement,
                  dropzone,
                )
                verifyChildrenLength()
              }
            }
          }
        })
        piece.addEventListener('drop', (e) => {
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
              const dropzoneRect = dropzone.getBoundingClientRect()
              const dropzoneCenterY = dropzoneRect.top + dropzoneRect.height / 2
              const draggableElementRect =
                draggableElement.getBoundingClientRect()
              const draggableElementCenterY =
                draggableElementRect.top + draggableElementRect.height / 2
              const lineData = draggableElement.dataset.line
              const lineData1 = dropzone.dataset.line
              if (lineData === lineData1 && dropzone.parentNode) {
                if (draggableElementCenterY < dropzoneCenterY) {
                  insertElBeforeDropzoneAndRemoveDuplicate(
                    dropzone.parentNode,
                    draggableElement.style.width,
                    draggableElement,
                    dropzone,
                  )
                  verifyChildrenLength()
                } else {
                  insertElAfterDropzoneAndRemoveDuplicate(
                    dropzone.parentNode,
                    draggableElement.style.width,
                    draggableElement,
                    dropzone,
                  )
                  verifyChildrenLength()
                }
              }
            }
          }
        })
        roundContainer.addEventListener('dragover', (e) => {
          e.preventDefault()
          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move'
          }
        })
        lineContainer.addEventListener('dragover', (e) => {
          e.preventDefault()
          if (e.dataTransfer) {
            e.dataTransfer.dropEffect = 'move'
          }
        })

        x += widthRatio * item.letters[i].length
        lineContainer.append(fragment)

        if (container) {
          container.append(lineContainer)
          lineContainer.style.display = 'none'
        }
        lineArr.push(piece)
      }
      lineContainer.style.top = `${y}px`
      lineContainer.style.height = `${pictureHeight / 10}px`
      roundArrays.push(lineArr)
      y += pictureHeight / 10
    })
  }
}

export interface ImagePieceData {
  pieces: number
  letters: string[]
}

export function insertElBeforeTempEl(
  container: HTMLElement | ParentNode,
  elWidth: string,
  el: HTMLElement,
) {
  for (let i = 0; i < container.children.length; i += 1) {
    const child = container.children[i]
    if (child instanceof HTMLElement) {
      if (
        child.classList.contains('temp-el')
        // &&        child.style.width === elWidth
      ) {
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
}

export function insertElAfterTempEl(
  container: HTMLElement | ParentNode,
  elWidth: string,
  el: HTMLElement,
) {
  for (let i = 0; i < container.children.length; i += 1) {
    const child = container.children[i]
    if (child instanceof HTMLElement) {
      if (
        child.classList.contains('temp-el')
        // &&        child.style.width === elWidth
      ) {
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
