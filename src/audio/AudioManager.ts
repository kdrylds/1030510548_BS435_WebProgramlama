export default class AudioManager {
  private bg?: HTMLAudioElement;
  private click?: HTMLAudioElement;
  private master = 0.8;
  private bgUrl: string;
  private clickUrl: string;

  constructor(bgUrl: string, clickUrl: string) {
    this.bgUrl = bgUrl;
    this.clickUrl = clickUrl;
  }

  init() {
    this.bg = new Audio(this.bgUrl);
    this.bg.loop = true;
    this.bg.preload = "auto";
    this.bg.volume = this.master;

    this.click = new Audio(this.clickUrl);
    this.click.preload = "auto";
    this.click.volume = Math.min(1, this.master * 0.9);

    // try autoplay once, fallback to gesture listeners
    this.bg.play().catch(() => {
      const start = () => {
        this.bg?.play().catch(() => {});
        window.removeEventListener("pointerdown", start);
        window.removeEventListener("keydown", start);
        window.removeEventListener("touchstart", start);
      };
      window.addEventListener("pointerdown", start, { once: true });
      window.addEventListener("keydown", start, { once: true });
      window.addEventListener("touchstart", start, { once: true });
    });
  }

  setMasterVolume(v: number) {
    this.master = Math.max(0, Math.min(1, v));
    if (this.bg) this.bg.volume = this.master;
    if (this.click) this.click.volume = Math.min(1, this.master * 0.9);
  }

  setMusic(on: boolean) {
    if (!this.bg) return;
    if (on) this.bg.play().catch(() => {});
    else {
      this.bg.pause();
      this.bg.currentTime = 0;
    }
  }

  setSfx() {
    // stored state managed externally; here we just keep click element ready
  }

  playClick() {
    try {
      if (!this.click) return;
      this.click.currentTime = 0;
      this.click.play().catch(() => {});
    } catch {}
  }

  dispose() {
    this.bg?.pause();
    this.bg = undefined;
    this.click = undefined;
  }
}