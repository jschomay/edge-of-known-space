import * as ROT from "../lib/rotjs"
import Scheduler from "../lib/rotjs/scheduler/speed"
import Level from "./level"
import XY from "./xy"
import TextBuffer from "./textbuffer"
import Being from "./being"

export default class Game {
  scheduler: Scheduler;
  engine: ROT.Engine;
  level: Level;
  display: ROT.Display;
  textBuffer: TextBuffer;

  constructor() {
    this.scheduler = new ROT.Scheduler.Speed();
    this.engine = new ROT.Engine(this.scheduler);
    let fontSize = window.innerWidth / 80;
    this.display = new ROT.Display({ fontSize });
    this.textBuffer = new TextBuffer(this.display);
    document.body.appendChild(this.display.getContainer()!);

    let level = new Level(this);
    this.level = level;
    this._switchLevel(level);

    this.textBuffer.write("Find the %c{orange}box%c{} with the ananas to win the game.  \nWatch out for %c{red}Pedro%c{}!")
    this.engine.start();
  }

  public draw(xy: XY): void {
    let entity = this.level!.getEntityAt(xy);
    if (!entity) { return; }
    let visual = entity.getVisual();
    this.display.draw(xy.x, xy.y, visual.ch, visual.fg, visual.bg || null);
  }

  public over(): void {
    this.engine.lock();
    // FIXME show something
  }

  private _switchLevel(level: Level): void {
    // remove old beings from the scheduler
    this.scheduler.clear();

    this.level = level;
    let size = this.level.getSize();

    let bufferSize = 3;
    this.display.setOptions({ width: size.x, height: size.y });
    this.textBuffer.configure({
      position: new XY(0, 0),
      size: new XY(size.x, bufferSize)
    });
    this.textBuffer.clear();

    let xy = new XY();
    for (let i = 0; i < size.x; i++) {
      xy.x = i;
      for (let j = 0; j < size.y; j++) {
        xy.y = j;
        this.draw(xy);
      }
    }

    /* add new beings to the scheduler */
    let beings = this.level.getBeings();
    for (let p in beings) {
      this.scheduler.add(beings[p] as Being, true);
    }
  }
}
