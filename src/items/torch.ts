import * as ROT from "../../lib/rotjs";
import XY from "../xy";
import MainLevel from "../level"
import FOV from "../../lib/rotjs/fov/fov";
import { LightPassesCallback, VisibilityCallback } from "../../lib/rotjs/fov/fov";
import Item from "."
import Crystal from "../entities/crystal";
import { Color } from "../../lib/rotjs";
import Officer from "../entities/officer";
import Log from "../entities/log";
import Bridge from "../entities/bridge";
import CrystalShard from "../entities/crystal-shard";
import Ship from "../entities/ship";

export const KEY = "2"
export const NAME = "Torch"

export default class TorchItem implements Item {
  key: string = KEY
  name: string = NAME
  color: string = "orange"
  active: boolean = false
  r: number = 5

  private _fov: FOV;
  private _level: MainLevel

  constructor(level: MainLevel) {
    this._level = level
    this.setPower()
    this._fov = new ROT.FOV.RecursiveShadowcasting(this._FOVLightPasses, { topology: 8 })
  }

  setPower() {
    this.r = { 1: 5, 2: 8, 3: 10, 4: 20 }[this._level.powerLevel] || 5
  }

  getFOV() {
    return { r: this.r, fov: this._fov, cb: this._FOVIlluminate };
  }

  _FOVLightPasses: LightPassesCallback = (x, y) => {
    let entity = this._level.getEntityAt(new XY(x, y), true, true)
    if (!entity) return false

    if (entity instanceof Ship) return false
    if (entity instanceof Bridge) return true
    if (entity instanceof CrystalShard) return true

    if (entity instanceof Crystal) {
      entity.visible = true
      if (entity.dense) {
        if (entity.clearing) return this._level.powerLevel > 3
        return false

      } else {
        let dist = this._level.player.getXY()!.dist8(new XY(x, y))
        if (this._level.powerLevel > 1 && dist < 3) return true
        return entity.clearing
      }
    }

    if (this._level.isSpecial(entity) && !(entity instanceof Log)) {
      entity.visible = true
      return false
    }
    if (!"=o".includes(entity.getVisual().ch)) return true
    return false
  }

  _FOVIlluminate: VisibilityCallback = (x, y, r, visibility) => {
    let xy = new XY(x, y)
    let e = this._level.getEntityAt(xy, true, true)
    if (e && e instanceof Log) {
      e = this._level.getEntityAt(xy, false, true)
    }
    if (!e) { return; }
    if (e instanceof Crystal && e.dense && this._level.powerLevel === 1) { return; }

    e.visible = true


    if (e instanceof Crystal && e.clearing) {
      let p = this._level.powerLevel
      let fgBase = Color.toHex([30 * p, 30 * p, 255])
      let multplier = Math.min(170, Math.round(255 * Math.pow((5 / r), 1) / 5))
      let fg = Color.add(Color.fromString(fgBase), [multplier, multplier, Math.floor(multplier / 2)]);
      this._level.game.display.draw(x, y, ".", Color.toHex(fg));

    } else {
      let { ch, fg } = e.getVisual()
      let multplier = Math.min(170, Math.round(255 * Math.pow((5 / r), 1) / 5))
      multplier += 10 * (this._level.powerLevel - 1)

      let fgBrighter = Color.add(Color.fromString(fg), [multplier, multplier, Math.floor(multplier / 2)]);
      this._level.game.display.draw(x, y, ch, Color.toHex(fgBrighter))
    }
  }

  onActivate() {
    this.active = true
    return true
  }

  onDeactivate() {
    this.active = false
    return true
  }
}
