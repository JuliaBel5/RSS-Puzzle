import { createElement } from '../utils/createElement'
import {
  insertElBeforeDropzoneAndRemoveDuplicate,
  verifyChildrenLength,
  insertElAfterDropzoneAndRemoveDuplicate
} from '../utils/utils'

export class Piece {
  piece: HTMLDivElement | undefined
  constructor() {
    this.init()
  }
  init() {
    this.piece = createElement('div', 'image-piece')

    this.piece.addEventListener('dragstart', (e) => {
      if (e.dataTransfer && e.target && e.target instanceof HTMLElement) {
        e.dataTransfer.setData('text', e.target.id)
      }
    })

    this.piece.addEventListener('drop', (e) => {
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
          const draggableElementRect = draggableElement.getBoundingClientRect()
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
  }
}
