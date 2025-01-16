import * as ROT from "../../lib/rotjs";
import Entity from "../entity";
import XY from "../xy";
import Game from "../game";
import { SpeedActor } from "../../lib/rotjs";
import Log from "./log";
import Cliff from "./cliff";
import { KEY as EVKey } from "../items/ev";

export default class Player extends Entity implements SpeedActor {
  private _keys: { [key: number]: number };
  private ready: boolean;
  constructor(game: Game) {
    super(game, { ch: "@", fg: "yellow" });

    this.ready = true;

    this._keys = {};
    this._keys[ROT.KEYS.VK_UP] = 0;
    this._keys[ROT.KEYS.VK_W] = 0;
    this._keys[ROT.KEYS.VK_K] = 0;
    this._keys[ROT.KEYS.VK_RIGHT] = 1;
    this._keys[ROT.KEYS.VK_D] = 1;
    this._keys[ROT.KEYS.VK_L] = 1;
    this._keys[ROT.KEYS.VK_DOWN] = 2;
    this._keys[ROT.KEYS.VK_S] = 2;
    this._keys[ROT.KEYS.VK_J] = 2;
    this._keys[ROT.KEYS.VK_LEFT] = 3;
    this._keys[ROT.KEYS.VK_H] = 3;
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

    let context = this.getLevel().activeItem === EVKey || this.getLevel().ev.playerIsRiding()
      ? this.getLevel().ev
      : this;
    let keyHandled = context._handleKey(e.keyCode);
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
    let terrainEntity = this.getLevel()!.getEntityAt(newXY, false, true);
    let specialEntity = this.getLevel()!.getEntityAt(newXY, true, false);

    if (!terrainEntity && !specialEntity) {
      // should never happen unless moving beyond map
      return false
    }

    let msg = ""
    let madeDiscovery = false

    if (terrainEntity && !terrainEntity.visible) {
      terrainEntity.visible = true
      msg = "I'm exploring into the unknown. "
    }

    if (specialEntity && !specialEntity.visible && !(specialEntity instanceof Log)) {
      specialEntity.visible = true;
      msg = "I found something."
      madeDiscovery = true
    }

    if (specialEntity instanceof Cliff) {
      msg = Cliff.msg
    }


    this.getLevel()!.textBuffer.write(msg)
    this.getLevel().draw(newXY)

    if (madeDiscovery) { return true }

    let entity_at_xy = this.getLevel().getEntityAt(newXY)


    if (entity_at_xy!.onInteract(this)) {
      this.moveTo(newXY);
    }
    if (!this.getLevel().textBuffer.showing) {
      // draw over text buffer, so skip if showing
      this.getLevel().updateFOV()
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



