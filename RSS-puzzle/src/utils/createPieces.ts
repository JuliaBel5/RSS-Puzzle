import { state } from '../main'
import { createElement } from './createElement'

export function createImagePieces(
  container: HTMLElement,
  roundContainer: HTMLElement,
  curLineNumber: number,
  roundArrays: HTMLElement[][],
  list: ImagePieceData[],
  backgroundImageUrl: string = 'brown-background.jpg',
) {
  let y = 0
  //  const minWidth = '50px'
  //  const maxWidth = '300px'
  const pictureElement = document.querySelector('.picture')
  if (pictureElement instanceof HTMLElement) {
    const pictureWidth = pictureElement.offsetWidth
    const pictureHeight = pictureElement.offsetHeight
    const fragment = document.createDocumentFragment();

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

        piece.style.width = `${widthRatio * item.letters[i].length}px`
        piece.style.height = `${pictureHeight / 10}px`
        piece.style.backgroundPosition = `-${x}px -${y}px`
        piece.setAttribute('draggable', 'true')
        piece.setAttribute('id', `${index}-${i}`)
        piece.textContent = item.letters[i]
        piece.style.backgroundImage = `url(${backgroundImageUrl})`
        piece.setAttribute('data-line', lineNumber.toString())
        piece.setAttribute(
          'background-position',
          piece.style.backgroundPosition,
        )
        fragment.appendChild(piece);
        //lineContainer.append(piece)
        

        piece.addEventListener('dragstart', function (e) {
          if (e.dataTransfer && e.target && e.target instanceof HTMLElement) {
            e.dataTransfer.setData('text', e.target.id)
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
                dropzone.append(draggableElement)
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
              const lineData =
                draggableElement.parentElement.getAttribute('data-line')

              if (
                state.lineNumber === Number(lineData) &&
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
           
           
            if (draggableElement && dropzone && draggableElement.parentElement && dropzone.parentElement) {
              const dropzoneRect = dropzone.getBoundingClientRect()
              const dropzoneCenterY = dropzoneRect.top + dropzoneRect.height / 2
              const draggableElementRect =
                draggableElement.getBoundingClientRect()
              const draggableElementCenterY =
                draggableElementRect.top + draggableElementRect.height / 2
                const lineData = draggableElement.parentElement.getAttribute('data-line')
                const lineData1 = dropzone.parentElement.getAttribute('data-line')
              if (lineData === lineData1 && dropzone.parentNode) {
                
               console.log((Number(lineData)) )
                if (draggableElementCenterY < dropzoneCenterY) {
                  dropzone.parentNode.insertBefore(draggableElement, dropzone)
                  verifyChildrenLength()
                } else {
                  dropzone.parentNode.insertBefore(
                    draggableElement,
                    dropzone.nextSibling,
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
        lineContainer.append(fragment);

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

/*function swapWidths(a: HTMLElement, b: HTMLElement) {
  if (a.parentNode === b.parentNode && a !== b) {
    const tempWidth = a.style.width
    a.style.width = b.style.width
    b.style.width = tempWidth
  }
}
function findNextRenderedElement(currentElement: HTMLElement, roundArrays: HTMLElement[][], id: number): HTMLElement {
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

export function verifyChildrenLength() {
  const button = document.getElementById('check')
  const roundContainer = document.getElementById('round-container')
  if (roundContainer && button) {
    if (
      allChildrenHaveClass(roundContainer, 'temp-el') ||
      roundContainer.children.length === 0
    ) {
      button.classList.remove('disabled2')
      button.classList.add('continue')
    } else {
      button.classList.remove('continue')
      button.classList.add('disabled2')
    }
  }
}

export function allChildrenHaveClass(
  container: HTMLElement,
  className: string,
): boolean {
  for (let i = 0; i < container.children.length; i++) {
    if (!container.children[i].classList.contains(className)) {
      return false
    }
  }
  return true
}

/*const array1: { pieces: number; letters: string[] }[] = [
  {
    pieces: 8,
    letters: 'The students agree they have too much homework'.split(' '),
  },
  { pieces: 7, letters: 'They arrived at school at 7 a.m'.split(' ') },
  { pieces: 5, letters: 'Is your birthday in August?'.split(' ') },
  { pieces: 8, letters: 'There is a small boat on the lake'.split(' ') },
  { pieces: 5, letters: 'I ate eggs for breakfast'.split(' ') },
  { pieces: 7, letters: 'I brought my camera on my vacation'.split(' ') },
  {
    pieces: 9,
    letters: 'The capital of the United States is Washington, D.C'.split(' '),
  },
  {
    pieces: 9,
    letters: 'Did you catch the ball during the baseball game?'.split(' '),
  },
  { pieces: 6, letters: 'People feed ducks at the lake'.split(' ') },
  { pieces: 6, letters: 'The woman enjoys riding her bicycle'.split(' ') },
]*/
