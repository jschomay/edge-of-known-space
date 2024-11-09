import Entity from "./entity";
import Being from "./being";
import XY from "./xy";
import Game from "./game";
import Digger from "../lib/rotjs/map/digger";
import { RNG } from "../lib/rotjs";
import Player, { Pedro } from "./player";


export default class Level {
  private _size: XY;
  private _beings: Record<string, Entity>;
  private _map: Record<string, Entity>;
  private _freeCells: string[]
  game: Game
  player: Player
  _ananas: string

  constructor(game: Game) {
    this.game = game;
    this._beings = {};
    this._map = {};
    this._size = new XY(80, 25);
    this._freeCells = []

    this._generateMap()
    this._generateBoxes();
    this.player = new Player(game)
    this._createBeing(this.player);
    this._createBeing(new Pedro(game));
  }

  _generateMap() {
    var digger = new Digger(this.game.width, this.game.height);

    var digCallback = function(this: Level, x, y, value) {
      if (value) { return; }

      let floor = new Entity({ ch: ".", fg: "#888" }, this.game);
      var key = x + "," + y;
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
