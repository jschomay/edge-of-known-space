import * as ROT from "../../lib/rotjs";
import Entity from "../entity";
import XY from "../xy";
import Game from "../game";
import pubsub from "../pubsub";
import { SpeedActor } from "../../lib/rotjs";

export default class Player extends Entity implements SpeedActor {
  private _keys: { [key: number]: number };
  private ready: boolean;
  constructor(game: Game) {
    super(game, { ch: "@", fg: "yellow" });

    this.ready = false;

    this._keys = {};
    this._keys[ROT.KEYS.VK_UP] = 0;
    this._keys[ROT.KEYS.VK_W] = 0;
    this._keys[ROT.KEYS.VK_RIGHT] = 1;
    this._keys[ROT.KEYS.VK_D] = 1;
    this._keys[ROT.KEYS.VK_DOWN] = 2;
    this._keys[ROT.KEYS.VK_S] = 2;
    this._keys[ROT.KEYS.VK_LEFT] = 3;
    this._keys[ROT.KEYS.VK_A] = 3;


    this._keys[ROT.KEYS.VK_ENTER] = -1;
  }

  getSpeed() {
    return 1;
  }

  act() {
    this.getLevel()!.textBuffer.flush();
    this.game.engine.lock();
    this.ready = true;
  }


  onKeyDown(e: KeyboardEvent) {
    if (!this.ready) { return; }

    let keyHandled = this._handleKey(e.keyCode);
    if (keyHandled) {
      this.ready = false;
      this.game.engine.unlock();
    }
  }

  _handleKey(keyCode: number): boolean {
    if (!(keyCode in this._keys)) { return false; }


    let action = this._keys[keyCode];
    if (action == -1) {
      /* FIXME show something? */
      return true;
    }


    let dir = ROT.DIRS[4][action];
    let newXY = this.getXY()!.plus(new XY(dir[0], dir[1]));
    let entity_at_xy = this.getLevel()!.getEntityAt(newXY);

    if (!(entity_at_xy)) {
      this.getLevel()!.textBuffer.write("I'm not equipped to explore into the unknown.")
      return false
    }

    if (entity_at_xy.onInteract(this)) {
      this.moveTo(newXY);
      // BUG? this can draw over the displayBox, might have to check if it is open
      this.getLevel().updateFOV()
    } else {
    }
    return true;

  }

  moveTo(xy: XY) {
    let oldPos = this.getXY();
    this.setPosition(xy)
    this.getLevel()!.draw(oldPos!);
    this.getLevel()!.draw(xy);
  }

}



