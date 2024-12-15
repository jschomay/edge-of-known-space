import * as ROT from "../../lib/rotjs";
import XY from "../xy";
import MainLevel from "../level"
import FOV from "../../lib/rotjs/fov/fov";
import { LightPassesCallback, VisibilityCallback } from "../../lib/rotjs/fov/fov";
import Item from "."
import Crystal from "../entities/crystal";
import { Color } from "../../lib/rotjs";
import Officer from "../entities/officer";

export default class ScannerItem implements Item {
  key: string = "2"
  name: string = "Scanner"
  color: string = "pink"
  active: boolean = false

  private _fov: FOV;
  private _level: MainLevel

  constructor(level: MainLevel) {
    this._level = level
    this._fov = new ROT.FOV.RecursiveShadowcasting(this._FOVLightPasses, { topology: 8 })
  }

  getFOV() {
    return { r: 8, fov: this._fov, cb: this._FOVIlluminate };
  }

  _FOVLightPasses: LightPassesCallback = (x, y) => {
    let entity = this._level.getEntityAt(new XY(x, y), true, true)
    if (!entity) return false
    if ("#.".includes(entity.getVisual().ch)) return true
    return false
  }

  _FOVIlluminate: VisibilityCallback = (x, y, r, visibility) => {
    let xy = new XY(x, y)
    let e = this._level.getEntityAt(xy, true, true)
    if (!e) { return; }

    e.visible = true

    if (e instanceof Crystal && e.clearing) {
      let fgBase = "#00f"
      let multplier = Math.min(170, Math.round(255 * Math.pow((5 / r), 1) / 5))
      let fg = Color.add(Color.fromString(fgBase), [multplier, multplier, Math.floor(multplier / 2)]);
      this._level.game.display.draw(x, y, ".", Color.toHex(fg));

    } else {
      let { ch, fg } = e.getVisual()
      let multplier = Math.min(170, Math.round(255 * Math.pow((5 / r), 1) / 5))
      let fgBrighter = Color.add(Color.fromString(fg), [multplier, multplier, Math.floor(multplier / 2)]);
      this._level.game.display.draw(x, y, ch, Color.toHex(fgBrighter))
    }
  }

  onActivate() {
    this.active = true
  }

  onDeactivate() {
    this.active = false
  }
}
