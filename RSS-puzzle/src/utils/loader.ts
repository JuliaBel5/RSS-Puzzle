import { createElement } from './createElement'

export function showLoader(): void {
  const loader = createElement('div', 'loader')
  document.body.appendChild(loader)
  setTimeout(() => {
    document.body.removeChild(loader)
  }, 500)
}
