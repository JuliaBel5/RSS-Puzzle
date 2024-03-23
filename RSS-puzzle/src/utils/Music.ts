/* export class Music {
  if (localStorage.getItem('julMuted'): string) {
  static isMuted = JSON.parse(localStorage.getItem('julMuted')) ?? false
  }
  audio: HTMLAudioElement
  path: string

  constructor() {
    this.audio = new Audio()
    this.audio.volume = 0.3
    this.path = ''
  }

  mute() {
    Music.isMuted = true
  }

  unmute() {
    Music.isMuted = false
  }

  toggleMute() {
    if (Music.isMuted) {
      this.unmute()
    } else {
      this.mute()
    }
  }

  play(soundFile) {
    if (Music.isMuted) return

    this.reset()

    if (!this.audio.src.endsWith(soundFile)) {
      this.audio.src = soundFile
    }

    this.audio.play()
  }

  pause() {
    this.audio.pause()
  }

  stop() {
    this.pause()
    this.reset()
  }

  reset() {
    this.audio.currentTime = 0
  }
}
*/
