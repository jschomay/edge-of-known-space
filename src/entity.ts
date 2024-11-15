import XY from './xy'
import Level from './level'
import Game from './game'

export type Visual = { ch: string, fg: string };

export default class Entity {
  private _visual: Visual;
  private _xy?: XY;
  private _level?: Level;
  game: Game;

  constructor(game: Game, visual: Visual = { ch: "!", fg: "red" }) {
    this.game = game
    this._visual = visual;
  }

  setVisual(visual: { ch?: string, fg?: string }) {
    this._visual = { ...this._visual, ...visual };
  }

  getVisual() { return this._visual; }
  getXY() { return this._xy; }
  getLevel() { return this._level; }

  setPosition(xy: XY, level?: Level) {
    this._xy = xy;
    if (level) { this._level = level }
    return this;
  }

  isTraversable(entity: Entity) { return true; }
}
