import * as ROT from "../../lib/rotjs";
import XY from "../xy";
import MainLevel from "../level"
import FOV from "../../lib/rotjs/fov/fov";
import Item from "."
import Crystal from "../entities/crystal";
import { Color } from "../../lib/rotjs";

export default class TorchItem implements Item {
  key: string = "1"
  name: string = "Torch"
  color: string = "orange"
  active: boolean = false

  private _fov: FOV;
  private _level: MainLevel

  constructor(level: MainLevel) {
    this._level = level

    this._fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
      let entity = level.getEntityAt(new XY(x, y))?.getVisual()
      if (!entity) return false
      if (".@".includes(entity.ch)) return true
      // TODO change to check for crystal clearing
      if (entity instanceof Crystal) return entity.getVisual().ch === "/"
      return false
    }
      , { topology: 8 })

  }

  getFOV() {
    return { r: 4, fov: this._fov, cb: this._fovCb.bind(this) };
  }

  _fovCb(x: number, y: number, r: number, visibility: number) {
    if (r === 0) return;
    let xy = new XY(x, y)
    let e = this._level.getEntityAt(xy, true)
    if (!e) { return; }

    // TODO handle clearings
    if (e instanceof Crystal && false) {
      e.visible = true;
      // TODO how to hide again when out of fov?
      this._level.game.display.draw(x, y, e.getVisual().ch, e.getVisual().fg);

    } else {
      e = this._level.getEntityAt(xy)
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
