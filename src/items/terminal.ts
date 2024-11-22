import * as ROT from "../../lib/rotjs";
import XY from "../xy";
import MainLevel from "../level"
import FOV from "../../lib/rotjs/fov/fov";
import Item from "."
import Entity from "../entity";

export default class TerminalItem implements Item {
  key: string = "0"
  name: string = "Terminal"
  color: string = "green"
  active: boolean = false

  private _fov: FOV;
  private _logs: string[] = []
  private _level: MainLevel

  constructor(level: MainLevel) {
    this._level = level

    this._fov = new ROT.FOV.PreciseShadowcasting((x, y) =>
      ".@".includes(level.getEntityAt(new XY(x, y))?.getVisual().ch || "")
      , { topology: 4 })
  }

  getFOV() {
    return { r: 3, fov: this._fov, cb: this._fovCb.bind(this) };
  }

  _fovCb(x: number, y: number, r: number, visibility: number) {
    let xy = new XY(x, y)
    let e = this._level.getEntityAt(xy)
    if (!e) { return; }
    let ch =e.getVisual().ch
    if (ch != ".") { return; }
    this._level.game.display.draw(x, y, ch, "#bb0")
  }

  readLog(log: string) {
    this._logs.push(log)
    this._level.textBuffer.displayBox(log)
  }

  onActivate(logs: string[]) {
    this.active = true
  }

  onDeactivate() {
    this.active = false
  }
}
