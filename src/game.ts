import * as ROT from "../lib/rotjs"
import Scheduler from "../lib/rotjs/scheduler/speed"
import MainLevel from "./level"
import StartScreen from "./start-screen"
import XY from "./xy";

export default class Game {
  scheduler: Scheduler;
  engine: ROT.Engine;
  level: MainLevel | StartScreen;
  display: ROT.Display;
  HANDLED_KEYS = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "w", "a", "s", "d", "Enter", "Escape", " "];

  constructor() {
    this.scheduler = new ROT.Scheduler.Speed();
    this.engine = new ROT.Engine(this.scheduler);
    let fontSize = window.innerWidth / 90;
    this.display = new ROT.Display({ fontSize });
    const container = this.display.getContainer()!
    container.classList.add("max-h-screen", "max-w-full")
    document.body.appendChild(container);

    // TODO only for debugging
    // let level = new MainLevel(this);
    let level = new StartScreen(this);
    this.level = level;
    this.switchLevel(level);
    this.engine.start();

    window.addEventListener("keydown", this.onKeyDown.bind(this));

    // debug (click to inspect entity)
    // container.addEventListener("click", e => console.log(this.level.getEntityAt(new XY(...this.display.eventToPosition(e)), true)))
  }

  public onKeyDown(e: KeyboardEvent) {
    if (this.HANDLED_KEYS.includes(e.key)) { e.preventDefault(); }
    this.level.onKeyDown(e);
  }


  switchLevel(level: MainLevel | StartScreen): void {
    this.level = level;
    let size = level.getSize();
    this.display.setOptions({ width: size.x, height: size.y });
  }
}
