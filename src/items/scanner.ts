import * as ROT from "../../lib/rotjs";
import XY from "../xy";
import MainLevel from "../level"
import FOV from "../../lib/rotjs/fov/fov";
import { LightPassesCallback, VisibilityCallback } from "../../lib/rotjs/fov/fov";
import Item from "."
import { Color } from "../../lib/rotjs";
import Rubble from "../entities/rubble";
import Crystal from "../entities/crystal";

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
  private _maxR = 10

  constructor(level: MainLevel) {
    this._level = level
    this._fov = new ROT.FOV.RecursiveShadowcasting(this._FOVLightPasses, { topology: 8 })
  }

  getFOV() {
    return { r: this._r, fov: this._fov, cb: this._FOVIlluminate };
  }

  _FOVLightPasses: LightPassesCallback = (x, y) => {
    return true
  }

  _FOVIlluminate: VisibilityCallback = (x, y, r, visibility) => {
    let xy = new XY(x, y)

    // first check for rubble
    let e = this._level.getEntityAt(xy, true, true)
    if (e && e instanceof Rubble) {
      e.scanned = true
    }

    // second only interact with terrain
    e = this._level.getEntityAt(xy, false, true)
    if (!e) { return; }

    let { ch } = e.getVisual()
    let highlightColor = Color.fromString("cyan")

    if (",.".includes(ch)) {
      e.visible = true
      highlightColor = Color.multiply(highlightColor, [150, 150, 150])
      this._level.game.display.draw(x, y, ch, Color.toHex(highlightColor))

    } else if (e instanceof Crystal) {
      let m = Color.randomize([100, 100, 100], 100)
      if (e.clearing) highlightColor = [50, 50, 50]
      highlightColor = Color.add(highlightColor, m)
      this._level.game.display.draw(x, y, ch, Color.toHex(highlightColor))
    }
    // TODO light up shard

  }

  onActivate() {
    // TODO lock the game loop so the player can't move
    this.active = true
    this._intervalID = setInterval(() => {
      this._r += 1
      if (this._r >= this._maxR) {
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
