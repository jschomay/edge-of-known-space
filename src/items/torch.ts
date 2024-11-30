import * as ROT from "../../lib/rotjs";
import XY from "../xy";
import MainLevel from "../level"
import FOV from "../../lib/rotjs/fov/fov";
import Item from "."
import Crystal from "../entities/crystal";
import { Color } from "../../lib/rotjs";
import Officer from "../entities/officer";

export default class TorchItem implements Item {
  key: string = "1"
  name: string = "Torch"
  color: string = "orange"
  active: boolean = false

  private _fov: FOV;
  private _level: MainLevel

  constructor(level: MainLevel) {
    this._level = level

    this._fov = new ROT.FOV.RecursiveShadowcasting((x, y) => {
      let entity = level.getEntityAt(new XY(x, y), true)
      if (!entity) return false
      if (entity instanceof Crystal) {
        entity.visible = true
        return entity.clearing
      }
      if (entity instanceof Officer) {
        entity.visible = true
        return false
      }
      if (!"=o".includes(entity.getVisual().ch)) return true
      return false
    }
      , { topology: 8 })

  }

  getFOV() {
    return { r: 4, fov: this._fov, cb: this._fovCb.bind(this) };
  }

  _fovCb(x: number, y: number, r: number, visibility: number) {
    let xy = new XY(x, y)
    let e = this._level.getEntityAt(xy)
    if (!e) { return; }

    if (e instanceof Crystal) {
      e.visible = true
      let { ch, fg } = e.getVisual()
      this._level.game.display.draw(x, y, ch, fg)
    }

    if (e instanceof Crystal && e.clearing) {
      let fgBase = "#00f"
      let multplier = Math.min(170, Math.round(255 * Math.pow((5 / r), 1) / 5))
      let fg = Color.add(Color.fromString(fgBase), [multplier, multplier, Math.floor(multplier / 2)]);
      this._level.game.display.draw(x, y, ".", Color.toHex(fg));

    } else {
      let { ch, fg } = e!.getVisual()
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
