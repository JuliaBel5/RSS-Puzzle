import { state } from "../../main";
import { createElement } from "../../utils/createElement";
import { Music } from "../../utils/music";
import { Header } from "../header";

export class GameView {
  gameArea: HTMLDivElement;
  header: Header;
  continueButton: any;
  roundContainer: HTMLDivElement | undefined;
  autoCompleteButton: HTMLButtonElement | undefined;
  catElement: HTMLImageElement | undefined;
  translationContainer: HTMLDivElement | undefined;
  audioElement: HTMLImageElement | undefined;
  game: HTMLDivElement | undefined;
  audio: Music | undefined;
  settingsContainer: any;
  picture: HTMLDivElement  | undefined;

  constructor() {
    this.gameArea = createElement('div', 'gamearea')
    this.header = new Header()
    this.header.init()
    document.body.append(this.gameArea)
    this.createSettings()

  }
  createSettings() {
    this.game = createElement('div', 'game', '')
        this.audio = new Music()
       
    this.translationContainer = createElement(
      'div',
      'translation-container',
      ''
    )
  
    this.settingsContainer = createElement('div', 'settings-container', '')
    this.audioElement = createElement('img', 'mini-audio0')
    this.audioElement.src = 'audioTip1.png'
    this.audioElement.addEventListener('click', () => {
      if (this.audio) {
        this.audio.play(state.audioSrc)
        if (this.audioElement instanceof HTMLImageElement) {
          this.audioElement.src = 'audioTipDis.png'
          this.audio.audio.addEventListener('ended', () => {
            if (
              this.audioElement &&
              this.audioElement instanceof HTMLImageElement
            ) {
              this.audioElement.src = 'audioTip1.png'
            }
          })
        }
      }
    })
    this.catElement = createElement('img', 'mini-cat')
    this.catElement.src = 'cat6a.png'
    this.catElement.style.display = 'none'
    this.catElement.addEventListener('click', () => {
      if (this.audio) {
        this.audio.play('meow2.mp3')
      }
    })
    this.settingsContainer.append(
      this.catElement,
      this.audioElement,
      this.translationContainer
    )
    this.game.append(this.settingsContainer)
    this.gameArea.append(this.game)
    this.continueButton = createElement(
      'button',
      'continue',
      'Check',
      'check'
    )
    this.autoCompleteButton = createElement(
      'button',
      'continue',
      'Help me',
      'autocomplete'
    )
  
    this.roundContainer = createElement(
      'div',
      'round-container',
      '',
      'round-container'
    )
    this.picture = createElement('div', 'picture', '', 'image')
    this.game.append(
      this.picture,
      this.roundContainer,
      this.autoCompleteButton,
      this.continueButton
    )
  
   }

}