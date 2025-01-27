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
    let fg = "darkred"
    if (e instanceof EV) {
      fg = e.getVisual().fg
    }
    this._level.game.display.draw(x, y, ch, fg)
  }

  onActivate() {
    // when unloaded, activates fov
    // when loaded with non-player, fov should already be active so this shouldn't hit
    // when loaded with player, fov is inactive, so this should hit
    // // attempt to unload player, don't activate fov at all
    let ev = this._level.ev

    if (!ev.isLoaded()) {
      this._fovCells = []
      this.active = true
      return true
    }

    if (!ev.playerIsRiding()) throw "unexpected onActivate while ev was loaded with non-player";

    ev.unload()
    return false
  }

  onDeactivate() {
    // when unloaded, deactivates fov
    // when loaded with non-player, fov should already be active so this hits
    // // attempt to unload, don't deactivate fov at all
    // when loaded with player, fov is inactive, so this shouldn't hit
    let ev = this._level.ev

    if (!ev.isLoaded()) {
      this._fovCells = []
      this.active = false
      return true
    }

    if (ev.playerIsRiding()) throw "unexpected onDeactivate while ev was loaded with player"

    ev.unload()
    // draw FOV over unloaded item
    this._level.updateFOV()
    return false
  }
}
