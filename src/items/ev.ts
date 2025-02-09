import * as ROT from "../../lib/rotjs";
import XY from "../xy";
import MainLevel from "../level"
import FOV from "../../lib/rotjs/fov/fov";
import { LightPassesCallback, VisibilityCallback } from "../../lib/rotjs/fov/fov";
import Item from "."
import EV from "../entities/ev";
import { KEY as LO_KEY } from "../entities/lo"
import { KEY as OFFICER_KEY } from "../entities/officer";

export const KEY = "5"
export const COLOR = "#d00"

export default class EVItem implements Item {
  key: string = KEY
  name: string = "EV2 remote"
  color: string = COLOR
  active: boolean = false

  private _fov: FOV;
  private _level: MainLevel
  private _r: number = 4
  private _fovCells: string[] = []

  constructor(level: MainLevel) {
    this._level = level
    this.setPower()
    this._fov = new ROT.FOV.RecursiveShadowcasting(this._FOVLightPasses, { topology: 8 })
  }

  setPower(): void {
    this._r = { 1: 4, 2: 8, 3: 12, 4: 13 }[this._level.powerLevel] || 4
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
    if (".^".includes(e.getVisual().ch)) fg = "darkred"
    if ((LO_KEY + OFFICER_KEY + "{o+?").includes(e.getVisual().ch)) fg = "yellow"
    if ("~".includes(e.getVisual().ch)) fg = "#500"
    if ("/\\|[".includes(e.getVisual().ch)) fg = "#500"

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
      this._fovCells.push(this._level.player.getXY()!.toString())
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
