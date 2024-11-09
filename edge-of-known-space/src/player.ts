import XY from "./xy";
import Being from "./being";
import * as ROT from "../lib/rotjs";
import Game from "./game";

export default class Player extends Being {
  private _keys: { [key: number]: number };
  constructor(game: Game) {
    super({ ch: "@", fg: "#fff" }, game);

    this._keys = {};
    this._keys[ROT.KEYS.VK_K] = 0;
    this._keys[ROT.KEYS.VK_UP] = 0;
    this._keys[ROT.KEYS.VK_NUMPAD8] = 0;
    this._keys[ROT.KEYS.VK_U] = 1;
    this._keys[ROT.KEYS.VK_NUMPAD9] = 1;
    this._keys[ROT.KEYS.VK_L] = 2;
    this._keys[ROT.KEYS.VK_RIGHT] = 2;
    this._keys[ROT.KEYS.VK_NUMPAD6] = 2;
    this._keys[ROT.KEYS.VK_N] = 3;
    this._keys[ROT.KEYS.VK_NUMPAD3] = 3;
    this._keys[ROT.KEYS.VK_J] = 4;
    this._keys[ROT.KEYS.VK_DOWN] = 4;
    this._keys[ROT.KEYS.VK_NUMPAD2] = 4;
    this._keys[ROT.KEYS.VK_B] = 5;
    this._keys[ROT.KEYS.VK_NUMPAD1] = 5;
    this._keys[ROT.KEYS.VK_H] = 6;
    this._keys[ROT.KEYS.VK_LEFT] = 6;
    this._keys[ROT.KEYS.VK_NUMPAD4] = 6;
    this._keys[ROT.KEYS.VK_Y] = 7;
    this._keys[ROT.KEYS.VK_NUMPAD7] = 7;

    this._keys[ROT.KEYS.VK_PERIOD] = -1;
    this._keys[ROT.KEYS.VK_CLEAR] = -1;
    this._keys[ROT.KEYS.VK_NUMPAD5] = -1;
  }

  act() {
    this.game.textBuffer.write("It is your turn, press any relevant key.");
    this.game.textBuffer.flush();
    this.game.engine.lock();
    window.addEventListener("keydown", this);
  }

  die() {
    Being.prototype.die.call(this);
    this.game.over();
  }

  handleEvent(e: KeyboardEvent) {
    let keyHandled = this._handleKey(e.keyCode);

    if (keyHandled) {
      window.removeEventListener("keydown", this);
      this.game.engine.unlock();
    }
  }

  _handleKey(keyCode: number) {
    if (keyCode in this._keys) {
      this.game.textBuffer.clear();

      let direction = this._keys[keyCode];
      if (direction == -1) { /* noop */
        /* FIXME show something? */
        return true;
      }

      let dir = ROT.DIRS[8][direction];
      let xy = this.getXY()!.plus(new XY(dir[0], dir[1]));

      this.getLevel()!.setEntity(this, xy); /* FIXME collision detection */
      return true;
    }

    return false; /* unknown key */
  }
}
