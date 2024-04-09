import { Piece } from '../components/piece'
import { createElement } from './createElement'
import { adjustAfterElementBackgroundPosition } from './utils'

export interface ImagePieceData {
  pieces: number
  letters: string[]
}

export function createImagePieces(
  container: HTMLElement | undefined,
  roundArrays: HTMLElement[][],
  list: ImagePieceData[],
  backgroundImageUrl = 'brown-background.jpg'
): HTMLElement[] {
  let containerArr: HTMLElement[] = []
  let y = 0
  const pictureElement = container
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
        //   const piece = createElement('div', 'image-piece')
        const piece = new Piece()
        if (piece.piece) {
          piece.piece.classList.add(`image-piece${i}`)
          const pieceWidth = Math.max(
            (pictureWidth / totalLetters) * item.letters[i].length,
            30
          )
          piece.piece.style.width = `${pieceWidth}px`
          // piece.style.width = `${widthRatio * item.letters[i].length}px`
          piece.piece.style.height = `${pictureHeight / 10}px`
          piece.piece.style.backgroundPosition = `-${x}px -${y}px`
          piece.piece.setAttribute('draggable', 'true')
          piece.piece.setAttribute('id', `${index}-${i}`)
          piece.piece.textContent = item.letters[i]
          piece.piece.style.backgroundImage = `url(${backgroundImageUrl})`
          piece.piece.dataset.line = lineNumber.toString()
          piece.piece.setAttribute(
            'background-position',
            piece.piece.style.backgroundPosition
          )

          if (i < item.letters.length - 1) {
            adjustAfterElementBackgroundPosition(
              piece.piece,
              piece.piece.style.width,
              piece.piece.style.height,
              x,
              y,
              backgroundImageUrl
            )
          }
          fragment.append(piece.piece)

          x += widthRatio * item.letters[i].length
          lineContainer.append(fragment)

          if (container) {
            container.append(lineContainer)
            lineContainer.style.display = 'none'
          }
          lineArr.push(piece.piece)
        }
      }
      lineContainer.style.top = `${y}px`
      lineContainer.style.height = `${pictureHeight / 10}px`
      roundArrays.push(lineArr)
      containerArr.push(lineContainer)
      y += pictureHeight / 10
    })
  }
  return containerArr
}
