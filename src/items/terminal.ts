import * as ROT from "../../lib/rotjs";
import XY from "../xy";
import MainLevel from "../level"
import FOV from "../../lib/rotjs/fov/fov";
import Item from "."
import Log from "../entities/log";

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
    let e = this._level.getEntityAt(xy, true)
    if (!e) { return; }
    if (e instanceof Log) {
      e.visible = true;
      this._level.game.display.draw(x, y, e.getVisual().ch, e.getVisual().fg);
      return
    } else {
      e = this._level.getEntityAt(xy)
    }
    let ch = e.getVisual().ch
    if (ch != ".") { return; }
    this._level.game.display.draw(x, y, ch, "#270")
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
