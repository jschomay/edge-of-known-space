import XY from "./xy";
import Being from "./being";
import * as ROT from "../lib/rotjs";
import Game from "./game";
import FOV from "../lib/rotjs/fov/fov";
import pubsub from "./pubsub";

export default class Player extends Being {
  private _keys: { [key: number]: number };
  private ready: boolean;
  private _fov: FOV;
  constructor(game: Game) {
    super({ ch: "@", fg: "yellow" }, game);

    this.ready = false;

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

    this._keys[ROT.KEYS.VK_ENTER] = -1;



    this._fov = new ROT.FOV.PreciseShadowcasting((x, y) =>
      !!this.getLevel()!.getEntityAt(new XY(x, y))
      , { topology: 8 })
  }

  getFOV() {
    return { r: 5, fov: this._fov };
  }

  act() {
    this.getLevel()!.textBuffer.flush();
    this.game.engine.lock();
    this.ready = true;
  }

  die() {
    Being.prototype.die.call(this);
  }

  handleEvent(e: KeyboardEvent) {
    if (!this.ready) { return; }

    let keyHandled = this._handleKey(e.keyCode);
    if (keyHandled) {
      this.ready = false;
      this.game.engine.unlock();
      pubsub.publish("player-act-complete", this, {})
    }
  }

  _handleKey(keyCode: number): boolean {
    if (!(keyCode in this._keys)) { return false; }

    this.getLevel()!.textBuffer.clear();

    let direction = this._keys[keyCode];
    if (direction == -1) { /* noop */
      /* FIXME show something? */
      return true;
    }


    let dir = ROT.DIRS[8][direction];
    let xy = this.getXY()!.plus(new XY(dir[0], dir[1]));
    let entity_at_xy = this.getLevel()!.getEntityAt(xy);
    if (!(entity_at_xy)) {
    } else if (entity_at_xy.getVisual().ch == "=") {
      this.getLevel()!.textBuffer.write("Can't go what way.")
      this._checkBox(xy);
    } else {
      this.getLevel()!.setBeing(this, xy);
    }
    return true;

  }

  _checkBox(xy: XY) {
    if (xy.toString() == this.getLevel()!._ananas) {
      this.getLevel()!.textBuffer.write("Hooray! You found an ananas and won this game.");
      this.game.scheduler.clear()
    } else {
      this.getLevel()!.getEntityAt(xy)!.setVisual({ ch: "+" });
      this.getLevel()!.draw(xy)
      this.getLevel()!.textBuffer.write("This %c{orange}box%c{} is empty :-(");
    }
  }
}



export class Pedro extends Being {
  path: [number, number][]
  constructor(game: Game) {
    super({ ch: "P", fg: "red" }, game);
    this.path = []
  }

  act() {

    var player_xy = this.getLevel()!.player.getXY()!;
    let { x: player_x, y: player_y } = player_xy
    let self = this
    var passableCallback = function(x, y) {
      return !!self.getLevel()!.getEntityAt(new XY(x, y));
    }
    var astar = new ROT.Path.AStar(player_x, player_y, passableCallback, { topology: 4 });

    // clear old path
    for (let i = 0; i < this.path.length - 1; i++) {
      let x = this.path[i][0];
      let y = this.path[i][1];
      if (x == player_x && y == player_y) {
        continue;
      }
      this.getLevel()!.draw(new XY(x, y));

    }

    this.path = [];
    self = this;
    var pathCallback = function(x, y) {
      self.path.push([x, y]);
    }
    let { x: pedro_x, y: pedro_y } = this.getXY()!
    astar.compute(pedro_x, pedro_y, pathCallback);

    this.path.shift(); /* remove Pedro's position */

    // draw path
    for (let i = 0; i < this.path.length - 1; i++) {
      let path_xy = new XY(this.path[i][0], this.path[i][1]);
      let ch = this.getLevel()!.getEntityAt(path_xy)!.getVisual().ch
      this.game.display.draw(path_xy.x, path_xy.y, ch, "red");

    }

    let x = this.path[0][0];
    let y = this.path[0][1];
    let xy = new XY(x, y)
    this.getLevel()!.setBeing(this, xy);

    if (this.path.length <= 2) {
      this.getLevel()!.textBuffer.clear()
      this.getLevel()!.textBuffer.write("Game over - you were captured by Pedro!");
      this.getLevel()!.textBuffer.flush()
      this.game.engine.lock();
      return;
    }
  }
}
