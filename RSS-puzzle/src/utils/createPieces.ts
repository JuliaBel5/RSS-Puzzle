import { createElement } from './createElement'
import {
  adjustAfterElementBackgroundPosition,
  insertElBeforeDropzoneAndRemoveDuplicate,
  verifyChildrenLength,
  insertElAfterDropzoneAndRemoveDuplicate
} from './utils'

export interface ImagePieceData {
  pieces: number
  letters: string[]
}

export function createImagePieces(
  container: HTMLElement,
  roundArrays: HTMLElement[][],
  list: ImagePieceData[],
  backgroundImageUrl = 'brown-background.jpg'
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
        lineNumber.toString()
      )
      lineContainer.style.position = 'absolute'
      lineContainer.setAttribute('draggable', 'true')
      lineContainer.dataset.line = lineNumber.toString()
      const lineArr: HTMLElement[] = []
      const totalLetters = item.letters.reduce(
        (acc, letters) => acc + letters.length,
        0
      )
      const widthRatio = pictureWidth / totalLetters

      let x = 0

      for (let i = 0; i < item.letters.length; i += 1) {
        const piece = createElement('div', 'image-piece')
        piece.classList.add(`image-piece${i}`)
        const pieceWidth = Math.max(
          (pictureWidth / totalLetters) * item.letters[i].length,
          30
        )
        piece.style.width = `${pieceWidth}px`
        // piece.style.width = `${widthRatio * item.letters[i].length}px`
        piece.style.height = `${pictureHeight / 10}px`
        piece.style.backgroundPosition = `-${x}px -${y}px`
        piece.setAttribute('draggable', 'true')
        piece.setAttribute('id', `${index}-${i}`)
        piece.textContent = item.letters[i]
        piece.style.backgroundImage = `url(${backgroundImageUrl})`
        piece.dataset.line = lineNumber.toString()
        piece.setAttribute(
          'background-position',
          piece.style.backgroundPosition
        )

        if (i < item.letters.length - 1) {
          adjustAfterElementBackgroundPosition(
            piece,
            piece.style.width,
            piece.style.height,
            x,
            y,
            backgroundImageUrl
          )
        }

        fragment.append(piece)

        piece.addEventListener('dragstart', (e) => {
          if (e.dataTransfer && e.target && e.target instanceof HTMLElement) {
            e.dataTransfer.setData('text', e.target.id)
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
              const dropzoneCenterX = dropzoneRect.left + dropzoneRect.width / 2
              const draggableElementRect =
                draggableElement.getBoundingClientRect()
              const draggableElementCenterX =
                draggableElementRect.left + draggableElementRect.width / 2
              const lineData = draggableElement.dataset.line
              const lineData1 = dropzone.dataset.line
              if (lineData === lineData1 && dropzone.parentNode) {
                if (draggableElementCenterX < dropzoneCenterX) {
                  insertElBeforeDropzoneAndRemoveDuplicate(
                    // нужно вставить драгбл перед дропом
                    dropzone.parentNode,
                    draggableElement.style.width,
                    draggableElement,
                    dropzone
                  )

                  verifyChildrenLength()
                } else {
                  insertElAfterDropzoneAndRemoveDuplicate(
                    // нужно вставить драгбл после дропа
                    dropzone.parentNode,
                    draggableElement.style.width,
                    draggableElement,
                    dropzone
                  )
                  verifyChildrenLength()
                }
              }
            }
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
