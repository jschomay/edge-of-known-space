import * as ROT from "../lib/rotjs"
import Scheduler from "../lib/rotjs/scheduler/speed"
import Level from "./level"
import XY from "./xy"
import Player from "./player"
import TextBuffer from "./textbuffer"
import Being from "./being"

export default class Game {
  scheduler: Scheduler;
  engine: ROT.Engine;
  player: Player;
  level: Level;
  display: ROT.Display;
  textBuffer: TextBuffer;

  constructor() {
    this.scheduler = new ROT.Scheduler.Speed();
    this.engine = new ROT.Engine(this.scheduler);
    this.display = new ROT.Display({ fontSize: 16 });
    this.textBuffer = new TextBuffer();
    document.body.appendChild(this.display.getContainer()!);
    this.player = new Player(this);

    // FIXME build a level and position a player
    let level = new Level(this);
    let size = level.getSize();
    this.level = level;
    this._switchLevel(level);
    this.level.setEntity(this.player, new XY(Math.round(size.x / 2), Math.round(size.y / 2)) );

    this.engine.start();
  }

  public draw(xy: XY): void {
    let entity = this.level!.getEntityAt(xy);
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
    this.display.setOptions({ width: size.x, height: size.y + bufferSize });
    this.textBuffer.configure({
      display: this.display,
      position: new XY(0, size.y),
      size: new XY(size.x, bufferSize)
    });
    this.textBuffer.clear();

    /* FIXME draw a level */
    let xy = new XY();
    for (let i = 0; i < size.x; i++) {
      xy.x = i;
      for (let j = 0; j < size.y; j++) {
        xy.y = j;
        this.draw(xy);
      }
    }

    /* add new beings to the scheduler */
    // FIXME separate beings from entitties
    let beings = this.level.getBeings();
    for (let p in beings) {
      this.scheduler.add(beings[p] as Being, true);
    }
  }
}
