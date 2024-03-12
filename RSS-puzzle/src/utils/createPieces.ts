import { createElement } from './createElement'

export function createImagePieces(
  list: { pieces: number; letters: string[] }[],
  backgroundImageUrl: string = "https://github.com/rolling-scopes-school/rss-puzzle-data/blob/main/images/level6/6_07.jpg?raw=true"
) {
  const container = document.getElementById('image')
  let y = 0;
  const pictureElement = document.querySelector('.picture');
  if (pictureElement instanceof HTMLElement) {
  const pictureWidth = pictureElement.offsetWidth;
  const pictureHeight = pictureElement.offsetHeight;
 

  list.forEach((item, index) => {
    const lineNumber = index + 1
    const lineContainer = createElement('div','line-container' )
    lineContainer.style.position = 'relative'

    const totalLetters = item.letters.reduce((acc, letters) => acc + letters.length, 0)
    const widthRatio = pictureWidth / totalLetters;

    let x = 0
    for (let i = 0; i < (item.letters).length; i++) {
      const piece = createElement('div', 'image-piece')
      piece.style.left = `${x}px`
      piece.style.top = `${y}px`
      piece.style.width = `${widthRatio * item.letters[i].length}px`; 
      piece.style.height = `${pictureHeight  / 10}px`
      piece.style.backgroundPosition = `-${x}px -${y}px`
      piece.setAttribute('draggable', 'true')
      piece.setAttribute('id', `${index}-${i}`)
      piece.textContent = item.letters[i]; 
      piece.style.backgroundImage = `url(${backgroundImageUrl})`;
      piece.setAttribute('data-line', lineNumber.toString())
      lineContainer.appendChild(piece)
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

      piece.addEventListener('drop', function (e) {
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
            const widthDelta =
              parseInt(dropzone.style.width) -
              parseInt(draggableElement.dataset.initialWidth)
            const direction =
              draggableElement.compareDocumentPosition(dropzone) &
              Node.DOCUMENT_POSITION_FOLLOWING
                ? 1
                : -1
            if (draggableElement instanceof HTMLElement) {
              const lineContainer = draggableElement.closest('.line-container')
              if (lineContainer && lineContainer.contains(dropzone)) {
                let startElement = direction > 0 ? draggableElement : dropzone

                let cumulativeWidthChange = 0
                if (direction < 0) {
                  // Если Draggable после dropzone, начальный элемент- дропзон
                  const tempWidth1 = draggableElement.style.width //ширина драга
                  const tempBkgPos1 = draggableElement.style.backgroundPosition
                  let tempTextContent1 = draggableElement.textContent
           
                  let tempWidth = dropzone.style.width
                  let tempBkgPos = dropzone.style.backgroundPosition
                  let tempTextContent = dropzone.textContent
                  dropzone.style.width = tempWidth1 // присваиваем (появилось смещение)
                   // Определяю начальный элемент для смещения деталей
                  let nextElement = startElement.nextElementSibling

                  while (nextElement && nextElement !== draggableElement.nextElementSibling) {
                    if (nextElement instanceof HTMLElement) {
                      const prevSibling = nextElement.previousElementSibling
                      if (prevSibling instanceof HTMLElement) {
                        if (tempWidth && tempBkgPos) {
                          const a = nextElement.style.width
                          const b = nextElement.style.backgroundPosition
                          const c = nextElement.textContent
                          nextElement.style.width = tempWidth
                          nextElement.textContent = tempTextContent
                          nextElement.style.backgroundPosition = tempBkgPos
                          tempWidth = a // новая длина
                          tempBkgPos = b // новый background position
                          tempTextContent = c
                        }
                      }
                      const finalPos =
                        parseInt(nextElement.style.left) +
                        (widthDelta - cumulativeWidthChange) * direction // сдвинули все
                      nextElement.style.left = `${finalPos}px`
                      cumulativeWidthChange +=
                        parseInt(nextElement.style.width) - parseInt(tempWidth)
                      console.log('cumul2', cumulativeWidthChange)
                      nextElement = nextElement.nextElementSibling
                    }
                  }

                  dropzone.style.backgroundPosition = tempBkgPos1
                  dropzone.textContent = tempTextContent1
                  cumulativeWidthChange = 0;
                } else {
                  console.log('draggable before dropzone')

                  // схранение текущего draggable element
                  const tempWidth1 = draggableElement.style.width
                  const tempBkgPos1 = draggableElement.style.backgroundPosition
                  const tempTextContent = draggableElement.textContent
                  let tempWidth = 0

                  let currentElement = draggableElement
                  while (
                    currentElement &&
                    currentElement instanceof Element &&
                    currentElement !== dropzone
                  ) {
                    const nextSibling = currentElement.nextElementSibling
                    if (nextSibling instanceof HTMLElement) {
                      currentElement.style.backgroundPosition =
                        nextSibling.style.backgroundPosition
                        currentElement.textContent = nextSibling.textContent
                      tempWidth = parseInt(currentElement.style.width)
                      currentElement.style.width = nextSibling.style.width
                      cumulativeWidthChange +=
                        parseInt(nextSibling.style.width) - tempWidth
                      const finalPos =
                        parseInt(nextSibling.style.left) + cumulativeWidthChange

                      nextSibling.style.left = `${finalPos}px`
                    }
                    if (
                      currentElement.nextElementSibling instanceof HTMLElement
                    ) {
                      currentElement = currentElement.nextElementSibling
                    }
                  }

                  dropzone.style.width = tempWidth1
                  dropzone.style.backgroundPosition = tempBkgPos1
                  dropzone.textContent = tempTextContent
                  cumulativeWidthChange = 0;
                }
              }
            }
          }
        }
      })

      piece.addEventListener('dragover', function (e) {
        e.preventDefault()
      })

      x += widthRatio * item.letters[i].length
    }

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
  { pieces: 3, letters: ("The students agree they have too much homework").split('') },
  { pieces: 2, letters:("They arrived at school at 7 a.m").split('')},
  { pieces: 4, letters: ("Is your birthday in August?").split('')},
  { pieces: 5, letters: ("There is a small boat on the lake").split('')},
  { pieces: 6, letters: ("I ate eggs for breakfast").split('') },
  { pieces: 7, letters: ("I brought my camera on my vacation").split('')},
  { pieces: 8, letters: ("The capital of the United States is Washington, D.C").split('')},
  { pieces: 9, letters: ("Did you catch the ball during the baseball game?").split('')},
  { pieces: 10, letters: ("People feed ducks at the lake").split('')},
  { pieces: 10, letters:("The woman enjoys riding her bicycle").split('')},
]

createImagePieces(imagePiecesData)
function swapWidths(a: HTMLElement, b: HTMLElement) {
  if (a.parentNode === b.parentNode && a !== b) {
    const tempWidth = a.style.width
    a.style.width = b.style.width
    b.style.width = tempWidth
  }
}
