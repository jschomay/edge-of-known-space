import * as ROT from "../lib/rotjs"
import Scheduler from "../lib/rotjs/scheduler/speed"
import MainLevel, { Level } from "./level"
import StartScreen from "./start-screen"

export default class Game {
  scheduler: Scheduler;
  engine: ROT.Engine;
  level: Level;
  display: ROT.Display;

  constructor() {
    this.scheduler = new ROT.Scheduler.Speed();
    this.engine = new ROT.Engine(this.scheduler);
    let fontSize = window.innerWidth / 80;
    this.display = new ROT.Display({ fontSize });
    document.body.appendChild(this.display.getContainer()!);

    window.addEventListener("keydown", this.onKeyDown.bind(this));

    // let level = new MainLevel(this);
    let level = new StartScreen(this);
    this.level = level;
    this._switchLevel(level);
    this.engine.start();
  }

  public onKeyDown(e: KeyboardEvent) {
    this.level.onKeyDown(e);
  }


  private _switchLevel(level: Level): void {
    this.level = level;
    let size = level.getSize();
    this.display.setOptions({ width: size.x, height: size.y });
  }
}
