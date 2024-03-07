export function createElement<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  className: string = '',
  content: string = '',
  id?: string, 
 ): HTMLElementTagNameMap[T] {
  const element = document.createElement(tag);
 
  if (className) {
     element.className = className;
  }
 
  if (content) {
     element.textContent = content;
  }
 
  if (id) { 
     element.id = id;
  }
 
  return element;
 }
