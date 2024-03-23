import { createElement } from '../utils/createElement';
// import { Music } from '../utils/Music'
const button = 'newround.mp3';

export class Stats {
  overlay: HTMLElement | null;

  section: HTMLElement;

  stats: HTMLElement | null;

  isShown: boolean;

  title: HTMLDivElement | undefined;

  message: HTMLDivElement | undefined;

  audio: HTMLAudioElement;

  statsContent: HTMLDivElement | undefined;

  statsButton: HTMLButtonElement | undefined;

  miniPicture: HTMLDivElement | undefined;

  dataContainer: HTMLDivElement | undefined;

  completedLinesTitle: HTMLDivElement | undefined;

  helpedLinesTitle: HTMLDivElement | undefined;

  completedLinesTitleContent: HTMLDivElement | undefined;

  helpedLinesTitleContent: HTMLDivElement | undefined;

  completedLinesTitleContainer: HTMLDivElement | undefined;

  helpedLinesTitleContainer: HTMLDivElement | undefined;

  completedLinesIcon: HTMLDivElement | undefined;

  helpedLinesIcon: HTMLDivElement | undefined;

  constructor(section: HTMLElement) {
    this.overlay = null;
    this.section = section;
    this.stats = null;
    this.isShown = false;
    this.audio = new Audio();
  }

  handleEnter = (event: KeyboardEvent) => {
    if (!event.code.endsWith('Enter')) return;

    this.remove();
  };

  create(title: string, message: string) {
    this.overlay = createElement('div', 'overlay');
    this.overlay.addEventListener('click', () => {});
    this.section.append(this.overlay);
    this.stats = createElement('div', 'modal0');
    this.statsContent = createElement('div', 'modal-content');
    this.title = createElement('div', 'title', title);
    this.miniPicture = createElement('div', 'mini-picture');
    this.dataContainer = createElement('div', 'data-container');
    this.completedLinesTitleContainer = createElement('div', 'title-container');
    this.completedLinesIcon = createElement('div', 'line-icon1');
    this.completedLinesTitle = createElement(
      'div',
      'line',
      'Lines completed without help',
    );
    this.completedLinesTitleContainer.append(
      this.completedLinesIcon,
      this.completedLinesTitle,
    );

    this.helpedLinesTitleContainer = createElement('div', 'title-container');
    this.helpedLinesIcon = createElement('div', 'line-icon2');
    this.helpedLinesTitle = createElement(
      'div',
      'line',
      'Lines completed with help',
    );
    this.helpedLinesTitleContainer.append(
      this.helpedLinesIcon,
      this.helpedLinesTitle,
    );
    this.completedLinesTitleContent = createElement('div', 'line-content');

    this.helpedLinesTitleContent = createElement('div', 'line-content');
    this.message = createElement('div', 'rules', message);
    this.statsButton = createElement(
      'button',
      'modal-button0',
      'Return to the game',
    );
    this.statsButton.addEventListener('click', () => {
      this.audio.src = button;
      this.audio.volume = 0.3;
      this.audio.play();
      this.remove();
    });

    this.stats.append(this.statsContent);
    this.dataContainer.append(
      this.completedLinesTitleContainer,
      this.helpedLinesTitleContainer,
    );
    this.completedLinesTitle.append(this.completedLinesTitleContent);
    this.helpedLinesTitle.append(this.helpedLinesTitleContent);
    this.statsContent.append(
      this.title,
      this.miniPicture,
      this.message,
      this.dataContainer,
      this.statsButton,
    );
    this.section.append(this.stats);
  }

  showStats(title: string, message: string) {
    this.isShown = true;
    this.create(title, message);
    document.addEventListener('keydown', this.handleEnter);
  }

  remove() {
    if (this.stats) {
      this.isShown = false;
      this.stats.remove();
      if (this.overlay) {
        this.overlay.remove();
      }

      document.removeEventListener('keydown', this.handleEnter);
    }
  }
}
