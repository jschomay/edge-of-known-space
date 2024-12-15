import * as ROT from "../../lib/rotjs";
import XY from "../xy";
import FOV from "../../lib/rotjs/fov/fov";
import { LightPassesCallback, VisibilityCallback } from "../../lib/rotjs/fov/fov";
import MainLevel from "../level"
import Item from "."
import Log from "../entities/log";

export default class TerminalItem implements Item {
  key: string = "0"
  name: string = "Terminal"
  color: string = "green"
  active: boolean = false

  private _logs: string[] = []
  private _level: MainLevel
  private _fov: FOV;

  constructor(level: MainLevel) {
    this._level = level
    this._fov = new ROT.FOV.PreciseShadowcasting(this._FOVLightPasses, { topology: 4 })
  }


  getFOV() {
    return { r: 3, fov: this._fov, cb: this._FOVIlluminate };
  }

  _FOVLightPasses: LightPassesCallback = (x, y) => {
    return true
    // let ch = this._level.getEntityAt(new XY(x, y))?.getVisual().ch || ""
    // return ".@".includes(ch)
  }


  _FOVIlluminate: VisibilityCallback = (x, y, r, visibility) => {
    // illuminates all special entities and ground
    let xy = new XY(x, y)
    let e = this._level.getEntityAt(xy, true)
    if (!e) { return; }
    if (this._level.isSpecial(e)) {
      e.visible = true;
      this._level.draw(xy)
      return
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
