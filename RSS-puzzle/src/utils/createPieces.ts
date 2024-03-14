import { createElement } from './createElement'

export function createImagePieces(
  container: HTMLElement,
  roundContainer: HTMLElement,
  curLineNumber: number,
  roundArrays: HTMLElement[][],
  list: { pieces: number; letters: string[] }[],
  backgroundImageUrl: string = 'https://github.com/rolling-scopes-school/rss-puzzle-data/blob/main/images/level6/6_07.jpg?raw=true',
) {
  let y = 0
  const pictureElement = document.querySelector('.picture')
  if (pictureElement instanceof HTMLElement) {
    const pictureWidth = pictureElement.offsetWidth
    const pictureHeight = pictureElement.offsetHeight

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
      lineContainer.setAttribute('data-line', lineNumber.toString())
      const lineArr: HTMLElement[] = []
      const totalLetters = item.letters.reduce(
        (acc, letters) => acc + letters.length,
        0,
      )
      const widthRatio = pictureWidth / totalLetters

      let x = 0

      for (let i = 0; i < item.letters.length; i++) {
        const piece = createElement('div', 'image-piece')
        //   piece.style.left = `${x}px`
        //   piece.style.top = `${y}px`
        piece.style.width = `${widthRatio * item.letters[i].length}px`
        piece.style.height = `${pictureHeight / 10}px`
        piece.style.backgroundPosition = `-${x}px -${y}px`
        piece.setAttribute('draggable', 'true')
        piece.setAttribute('id', `${index}-${i}`)
        piece.textContent = item.letters[i]
        piece.style.backgroundImage = `url(${backgroundImageUrl})`
        piece.setAttribute('data-line', lineNumber.toString())

        lineContainer.append(piece)

        if (container) {
          container.append(lineContainer)
        }

        piece.addEventListener('dragstart', function (e) {
          if (e.dataTransfer && e.target && e.target instanceof HTMLElement) {
            e.dataTransfer.setData('text', e.target.id)
            e.target.dataset.initialX = e.target.style.left
            e.target.dataset.initialY = e.target.style.top
            e.target.dataset.initialBgPos = e.target.style.backgroundPosition
            e.target.dataset.initialWidth = e.target.style.width
            this.dataset.initialBgPosX = this.style.backgroundPositionX
            this.dataset.initialBgPosY = this.style.backgroundPositionY
          }
        })
        lineContainer.addEventListener('drop', (e) => {
          e.preventDefault()
          if (e.dataTransfer && e.target && e.target instanceof HTMLElement) {
            const id = e.dataTransfer.getData('text')
            const draggableElement = document.getElementById(id)
            const dropzone = e.target
            const lineData = dropzone.getAttribute('data-line') // если это правильная строка
            if (draggableElement) {
              const lineDataDrag = draggableElement.getAttribute('data-line') //если это элемент из правильной строки
              if (
                curLineNumber === Number(lineData) &&
                dropzone.classList.contains('line-container') &&
                curLineNumber === Number(lineDataDrag)
              ) {
                console.log('Julia')
                dropzone.append(draggableElement)
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
              const lineData =
                draggableElement.parentElement.getAttribute('data-line')

              if (
                curLineNumber === Number(lineData) &&
                dropzone.classList.contains('round-container')
              ) {
                console.log('Julia')
                dropzone.append(draggableElement)
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
              draggableElement.dataset.initialWidth
            ) {
              const direction =
                draggableElement.compareDocumentPosition(dropzone) &
                Node.DOCUMENT_POSITION_FOLLOWING
                  ? 1
                  : -1
              const lineDataDropzone = dropzone.getAttribute('data-line')
              const lineDataDraggable =
                draggableElement.getAttribute('data-line')

              if (
                (draggableElement.parentElement === dropzone.parentElement &&
                  lineDataDropzone === lineDataDraggable) ||
                ((roundContainer.contains(dropzone) ||
                  roundContainer.contains(draggableElement)) &&
                  lineDataDropzone === lineDataDraggable)
              ) {
                if (direction < 0 && dropzone.parentElement) {
                  console.log('dropzone before draggable') // widthDelta отриц
                  dropzone.parentElement.insertBefore(
                    draggableElement,
                    dropzone,
                  )
                } else if (direction > 0 && dropzone.parentElement) {
                  dropzone.parentElement.insertBefore(
                    draggableElement,
                    dropzone.nextElementSibling,
                  )
                }
              }
            }
          }
        })
        roundContainer.addEventListener('dragover', (e) => {
          e.preventDefault()
        })
        lineContainer.addEventListener('dragover', (e) => {
          e.preventDefault()
        })
        piece.addEventListener('dragover', (e) => {
          e.preventDefault()
        })

        x += widthRatio * item.letters[i].length

        lineArr.push(piece)
      }
      lineContainer.style.top = `${y}px`
      lineContainer.style.height = `${pictureHeight / 10}px`
      roundArrays.push(lineArr)
      y += pictureHeight / 10
    })
  }
}

interface ImagePieceData {
  pieces: number
  letters: string[]
}
const list = [5, 6, 7, 4, 8, 5, 6, 7, 4, 9]

const imagePiecesData: ImagePieceData[] = [
  {
    pieces: 3,
    letters: 'The students agree they have too much homework'.split(''),
  },
  { pieces: 2, letters: 'They arrived at school at 7 a.m'.split('') },
  { pieces: 4, letters: 'Is your birthday in August?'.split('') },
  { pieces: 5, letters: 'There is a small boat on the lake'.split('') },
  { pieces: 6, letters: 'I ate eggs for breakfast'.split('') },
  { pieces: 7, letters: 'I brought my camera on my vacation'.split('') },
  {
    pieces: 8,
    letters: 'The capital of the United States is Washington, D.C'.split(''),
  },
  {
    pieces: 9,
    letters: 'Did you catch the ball during the baseball game?'.split(''),
  },
  { pieces: 10, letters: 'People feed ducks at the lake'.split('') },
  { pieces: 10, letters: 'The woman enjoys riding her bicycle'.split('') },
]

function swapWidths(a: HTMLElement, b: HTMLElement) {
  if (a.parentNode === b.parentNode && a !== b) {
    const tempWidth = a.style.width
    a.style.width = b.style.width
    b.style.width = tempWidth
  }
}
/*function findNextRenderedElement(currentElement: HTMLElement, roundArrays: HTMLElement[][], id: number): HTMLElement {
  const elements = roundArrays[id-1];
  console.log(elements);
  let nextElement;
  let minDifference = Infinity;
 
  if (elements) {
     console.log('yes');
     elements.forEach(element => {
       if (element !== currentElement) {
         const rect = element.getBoundingClientRect();
         const currentRect = currentElement.getBoundingClientRect();
          const difference = rect.left - currentRect.left;
 
         // Ensure the next element is to the right of the current element
         if (difference > 0 && difference < minDifference) {
           minDifference = difference;
           nextElement = element;
           console.log(element.textContent)
         }
       }
     });
  }

  return nextElement;
 }*/
