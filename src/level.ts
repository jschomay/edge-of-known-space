import Entity from "./entity";
import Being from "./being";
import XY from "./xy";
import Game from "./game";
import Digger from "../lib/rotjs/map/digger";
import { Color, RNG } from "../lib/rotjs";
import Player, { Pedro } from "./player";
import pubsub from "./pubsub";


export default class Level {
  private _size: XY;
  private _beings: Record<string, Entity>;
  private _map: Record<string, Entity>;
  private _freeCells: string[]
  private _fovCells: XY[] = []
  game: Game
  player: Player
  _ananas!: string

  constructor(game: Game) {
    this.game = game;
    this._beings = {};
    this._map = {};
    this._size = new XY(110, 40);
    this._freeCells = []

    this._generateMap()
    this._generateBoxes();
    this.player = new Player(game)
    this._createBeing(this.player);
    this._createBeing(new Pedro(game));

    pubsub.subscribe("player-act-complete", this);
  }

  handleMessage(msg: string, publisher: any, data: any) {
    if (msg === "player-act-complete") {
      this._updateFOV();
    }
  }

  _updateFOV() {
    // clear old FOV
    while (this._fovCells.length) {
      this.game.draw(this._fovCells.pop()!);
    }

    let { x: player_x, y: player_y } = this.player.getXY()!
    let { r: player_r, fov } = this.player.getFOV()

    // draw new FOV
    fov.compute(player_x, player_y, player_r, (x, y, r, visibility) => {
      let e = this.getEntityAt(new XY(x, y))
      if (!e) { return; }

      this._fovCells.push(new XY(x, y));
      let { ch, fg } = e.getVisual()
      let multplier = Math.round(255 * Math.pow((player_r / r), 3) / player_r)
      let fgBrighter = Color.add(Color.fromString(fg), [multplier, multplier, multplier]);
      this.game.display.draw(x, y, ch, Color.toHex(fgBrighter));
    });
  }


  _generateMap() {
    for (let i = 0; i < this._size.x; i++) {
      for (let j = 0; j < this._size.y; j++) {
        this.game.display.draw(i, j, "1", "#222");
      }
    }
    let topBorder = 3
    var digger = new Digger(this._size.x, this._size.y - topBorder);

    var digCallback = function(this: Level, x, y, value) {
      if (value) { return; }

      let floor = new Entity({ ch: ".", fg: "#888" }, this.game);
      var key = x + "," + (y + topBorder);
      this._map[key] = floor;
      this._freeCells.push(key);
    }
    digger.create(digCallback.bind(this));
  }

  _generateBoxes() {
    for (var i = 0; i < 10; i++) {
      var index = Math.floor(RNG.getUniform() * this._freeCells.length);
      var key = this._freeCells.splice(index, 1)[0];
      var box = new Entity({ ch: "=", fg: "orange" }, this.game);
      this._map[key] = box;
      if (!i) { this._ananas = key; } /* first box contains an ananas */
    }
  }

  _createBeing(b: Being) {
    var index = Math.floor(RNG.getUniform() * this._freeCells.length);
    var key = this._freeCells.splice(index, 1)[0];
    var parts = key.split(",");
    var x = parseInt(parts[0]);
    var y = parseInt(parts[1]);
    this.setEntity(b, new XY(x, y));
  }

  getSize() { return this._size; }

  setEntity(entity: Entity, xy: XY) {
    if (entity.getLevel() == this) {
      let oldXY = entity.getXY();
      if (null == oldXY) { return; }
      let key = oldXY.toString();
      delete this._beings[key];
      if (this.game.level == this) { this.game.draw(oldXY); }
    }

    entity.setPosition(xy, this); // propagate position data to the entity itself

    this._beings[xy.toString()] = entity;
    if (this.game.level == this) {
      this.game.draw(xy);
    }
  }

  getEntityAt(xy: XY): Entity | null {
    return this._beings[xy.toString()] || this._map[xy.toString()];
  }

  getBeings(): Record<string, Entity> {
    return this._beings;
  }
}
