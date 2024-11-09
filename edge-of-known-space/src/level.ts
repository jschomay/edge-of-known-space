import Entity from "./entity";
import XY from "./xy";
import Game from "./game";


export default class Level {
  private _size: XY;
  private _beings: Record<string, Entity>;
  private _map: Record<string, Entity>;
  private _empty: Entity;
  game: Game

  constructor(game: Game) {
    this.game = game;
    // FIXME data structure for storing entities
    this._beings = {};

    // FIXME map data
    this._size = new XY(80, 25);
    this._map = {};

    this._empty = new Entity({ ch: ".", fg: "#888"}, game);
  }

  getSize() { return this._size; }

  setEntity(entity: Entity, xy: XY) {
    // FIXME remove from old position, draw
    if (entity.getLevel() == this) {
      let oldXY = entity.getXY();
      if (null == oldXY) { return; }
      let key = oldXY.toString();
      delete this._beings[key];
      if (this.game.level == this) { this.game.draw(oldXY); }
    }

    entity.setPosition(xy, this); // propagate position data to the entity itself

    // FIXME set new position, draw
    this._beings[xy.toString()] = entity;
    if (this.game.level == this) {
      this.game.draw(xy);
      this.game.textBuffer.write("An entity moves to " + xy + ".");
    }
  }

  getEntityAt(xy: XY): Entity {
    return this._beings[xy.toString()] || this._map[xy.toString()] || this._empty;
  }

  getBeings(): Record<string, Entity> {
    // FIXME list of all beings
    return this._beings;
  }
}
