import Entity, { Visual } from "./entity";
import Game from "./game";
import Level from "./level";
import XY from "./xy";
import { SpeedActor } from '../lib/rotjs';

export default class Being extends Entity implements SpeedActor {
  private _speed: number;
  private _hp: number;

  constructor(visual: Visual, game: Game) {
    super(visual, game);
    this._speed = 100;
    this._hp = 10;
  }

  /**
   * Called by the Scheduler
   */
  getSpeed() { return this._speed; }

  damage(damage: number) {
    this._hp -= damage;
    if (this._hp <= 0) { this.die(); }
  }

  act() { /* FIXME */ }

  die() { this.game.scheduler.remove(this); }

  setPosition(xy: XY, level: Level) {
    // came to a currently active level; add self to the scheduler 
    if (level != this.getLevel() && level == this.game.level) {
      this.game.scheduler.add(this, true);
    }

    return super.setPosition(xy, level);
  }
}
