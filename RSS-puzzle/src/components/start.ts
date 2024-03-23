import { state } from '../main';
import { createElement } from '../utils/createElement';
import { Header } from './header';
import { Modal } from './modal';
import { rules } from './rules';
import { Toast } from './toast';
import { Validation } from './validation';

type HandlerFunction = () => void;

export class Start {
  gameArea: HTMLDivElement | undefined;

  startButton: HTMLButtonElement | undefined;

  user: string;

  modal: Modal | undefined;

  header: Header | undefined;

  toast = new Toast();

  lastName: string;
  audio: HTMLAudioElement | undefined;

  constructor() {
    this.user = state.user;
    this.lastName = state.lastName;

    this.startButton = createElement(
      'button',
      'startButton',
      'Start the Game',
      'startButton',
    );
  }

  init(): void {
    this.gameArea = createElement('div', 'gamearea');
    this.header = new Header(document.body);
    this.header.initStart();
    this.audio = new Audio();
    document.body.append(this.gameArea);
    this.modal = new Modal(this.gameArea);
    const container = createElement('div', 'startContainer');
    const welcome = createElement(
      'p',
      'welcomeMessage',
      `Welcome to CatPuzzle game, ${state.user} ${state.lastName}!`,
    );
    console.log(`Welcome to CatPuzzle game, ${this.user} ${this.lastName}!`);
    
    const leftPanel = createElement('div', 'leftStartPanel');
    leftPanel.style.cursor = 'pointer'
    leftPanel.addEventListener('click', () => {
      if (this.audio) {
      this.audio.src = 'meow3.mp3'
      this.audio.play()
      }
    })
    const rightPanel = createElement('div', 'rightStartPanel');
    const showRulesButton = createElement(
      'button',
      'startButton',
      'Show Game Rules',
    );
    showRulesButton.addEventListener('click', () => {
      if (this.modal) {
        this.modal.showModal('Game rules', rules);
        if (this.modal.message) {
          this.modal.message.innerHTML = rules;
        }
      }
    });

    this.gameArea.append(container);
    container.append(leftPanel, rightPanel);
    if (this.startButton) {
      rightPanel.append(welcome, showRulesButton, this.startButton);
    }
    
    
    this.header.bindLogout(this.confirm);
    this.toast.bindConfirmButton(this.logout);
  }

  bindStart = (handler: HandlerFunction): void => {
    if (this.startButton) {
      this.startButton.addEventListener('click', () => {
        handler();
        if (this.gameArea && this.header) {
          this.gameArea.remove();
          this.header.remove();
        }
      });
    }
  };

  confirm = () => {
    this.toast.show(`Are you sure you want to logout, ${state.user}?`);
  };

  logout = () => {
    localStorage.removeItem('catPuzzleUser');
    state.user = '';
    state.lastName = '';
    if (this.gameArea && this.header) {
      this.gameArea.remove();
      this.header.remove();
      new Validation();
    }
  };
}
