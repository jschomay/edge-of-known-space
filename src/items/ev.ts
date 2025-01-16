import * as ROT from "../../lib/rotjs";
import XY from "../xy";
import MainLevel from "../level"
import FOV from "../../lib/rotjs/fov/fov";
import { LightPassesCallback, VisibilityCallback } from "../../lib/rotjs/fov/fov";
import Item from "."
import EV from "../entities/ev";

export const KEY = "5"
export const COLOR = "#d00"

export default class EVItem implements Item {
  key: string = KEY
  name: string = "EV2 remote"
  color: string = COLOR
  active: boolean = false

  private _fov: FOV;
  private _level: MainLevel
  private _r: number = 7
  private _fovCells: string[] = []

  constructor(level: MainLevel) {
    this._level = level
    this._fov = new ROT.FOV.RecursiveShadowcasting(this._FOVLightPasses, { topology: 8 })
  }

  getFOV() {
    return { r: this._r, fov: this._fov, cb: this._FOVIlluminate };
  }

  isInRange(xy: XY) {
    return this._fovCells.includes(xy.toString())
  }

  _FOVLightPasses: LightPassesCallback = (x, y) => {
    return true
  }

  _FOVIlluminate: VisibilityCallback = (x, y, r, visibility) => {
    let xy = new XY(x, y)
    let e = this._level.getEntityAt(xy)
    if (!e) { return; }
    this._fovCells.push(xy.toString())

    let { ch } = e.getVisual()
    let fg = "red"
    if (e instanceof EV) {
      fg = e.getVisual().fg
    }
    this._level.game.display.draw(x, y, ch, fg)
  }

  onActivate() {
    if (this._level.ev.isLoaded()) {
      this._level.ev.unload()
      this._level.deactivateItem(this.key)
    } else {
      this.active = true
    }
  }

  onDeactivate() {
    this._fovCells = []
    this.active = false
  }
}
