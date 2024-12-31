import * as ROT from "../../lib/rotjs";
import XY from "../xy";
import MainLevel from "../level"
import FOV from "../../lib/rotjs/fov/fov";
import { LightPassesCallback, VisibilityCallback } from "../../lib/rotjs/fov/fov";
import Item from "."
import { Color } from "../../lib/rotjs";
import Rubble from "../entities/rubble";

export default class ScannerItem implements Item {
  key: string = "3"
  name: string = "Scanner"
  color: string = "#55f"
  active: boolean = false
  _initialR: number = 1
  _r: number = 1
  _intervalID: number = -1

  private _fov: FOV;
  private _level: MainLevel

  constructor(level: MainLevel) {
    this._level = level
    this._fov = new ROT.FOV.RecursiveShadowcasting(this._FOVLightPasses, { topology: 8 })
  }

  getFOV() {
    return { r: this._r, fov: this._fov, cb: this._FOVIlluminate };
  }

  _FOVLightPasses: LightPassesCallback = (x, y) => {
    let entity = this._level.getEntityAt(new XY(x, y), true, true)
    if (!entity) return false
    if (entity instanceof Rubble) return true
    if (".".includes(entity.getVisual().ch)) return true
    return false
  }

  _FOVIlluminate: VisibilityCallback = (x, y, r, visibility) => {
    let xy = new XY(x, y)
    let e = this._level.getEntityAt(xy, true, true)
    if (!e) { return; }
    let { ch, fg } = e.getVisual()

    if (e instanceof Rubble) {
      e.visible = true
      e.scanned = true

    } else if (ch === ".") {
      e.visible = true
      let fgBrighter = Color.add(Color.fromString(fg), [0, 0, 200]);
      this._level.game.display.draw(x, y, ch, Color.toHex(fgBrighter))
    }

  }

  onActivate() {
    // TODO lock the game loop so the player can't move
    this.active = true
    this._intervalID = setInterval(() => {
      this._r += 1
      if (this._r >= 15) {
        this._level.deactivateItem(this.key)
      }
      this._level.updateFOV()
    }, 70)
  }

  onDeactivate() {
    clearInterval(this._intervalID)
    this._r = this._initialR
    this.active = false
  }
}
