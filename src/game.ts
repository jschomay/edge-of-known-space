import * as ROT from "../lib/rotjs"
import Scheduler from "../lib/rotjs/scheduler/speed"
import EndScreen from "./end-screen";
import MainLevel from "./level"
import StartScreen from "./start-screen"
import XY from "./xy";

export default class Game {
  scheduler: Scheduler;
  engine: ROT.Engine;
  level: MainLevel | StartScreen;
  display: ROT.Display;
  HANDLED_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d", "Enter", "Escape", " "];

  _container: HTMLElement

  constructor(startBgTrack: () => void) {
    this.startBgTrack = startBgTrack
    this.scheduler = new ROT.Scheduler.Speed();
    this.engine = new ROT.Engine(this.scheduler);
    const scalar = 80
    let fontSize = window.innerWidth / scalar;
    window.addEventListener("resize", () => {
      fontSize = window.innerWidth / scalar;
      this.display.setOptions({ fontSize });
    })
    this.display = new ROT.Display({ fontSize });
    this._container = this.display.getContainer()!
    this._container.classList.add("max-h-screen", "max-w-full", "scale-y-90")
    document.body.appendChild(this._container);

    // TODO only for debugging
    // let level = new MainLevel(this);
    // let level = new EndScreen(this);
    let level = new StartScreen(this);
    this.level = level;
    this.switchLevel(level);
    this.engine.start();

    window.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  public onKeyDown(e: KeyboardEvent) {
    if (this.HANDLED_KEYS.includes(e.key)) { e.preventDefault(); }
    this.level.onKeyDown(e);
  }


  switchLevel(level: MainLevel | StartScreen | EndScreen): void {
    this.level = level;
    if (level instanceof MainLevel) this.startBgTrack()
    let size = level.getSize();
    this.display.setOptions({ width: size.x, height: size.y });
  }
}
