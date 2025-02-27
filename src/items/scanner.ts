import * as ROT from "../../lib/rotjs";
import XY from "../xy";
import MainLevel from "../level"
import FOV from "../../lib/rotjs/fov/fov";
import { LightPassesCallback, VisibilityCallback } from "../../lib/rotjs/fov/fov";
import Item from "."
import { Color } from "../../lib/rotjs";
import Rubble from "../entities/rubble";
import Crystal from "../entities/crystal";
import CrystalShard from "../entities/crystal-shard";
import { KEY as SHARD_KEY } from "../entities/crystal-shard";
import { KEY as OFFICER_KEY } from "../entities/officer";
import Log from "../entities/log";
import Passage from "../entities/passage";
import Boulder from "../entities/boulder";

export const NAME = "Scanner"

export default class ScannerItem implements Item {
  key: string = "3"
  name: string = NAME
  color: string = "#55f"
  active: boolean = false
  _initialR: number = 1
  _r: number = 1
  _intervalID: number = -1

  private _fov: FOV;
  private _level: MainLevel
  private _maxR: number = 7

  constructor(level: MainLevel) {
    this._level = level
    this.setPower()
    this._fov = new ROT.FOV.RecursiveShadowcasting(this._FOVLightPasses, { topology: 8 })
  }

  setPower() {
    this._maxR = { 1: 7, 2: 15, 3: 20, 4: 30 }[this._level.powerLevel] || 7
  }

  getFOV() {
    return { r: this._r, fov: this._fov, cb: this._FOVIlluminate };
  }

  _FOVLightPasses: LightPassesCallback = (x, y) => {
    return true
  }

  _FOVIlluminate: VisibilityCallback = (x, y, r, visibility) => {
    let xy = new XY(x, y)

    let special = this._level.getEntityAt(xy, true, false)
    let terrain = this._level.getEntityAt(xy, false, true)
    let highlightColor = Color.fromString("cyan")

    if (special && special instanceof Rubble) {
      special.scanned = true
      return
    }

    if (special && special instanceof Passage && this._level.powerLevel > 1) {
      special.scanned = true
      return
    }

    // officers, ships and items and ev show up white
    if (special && (special.item || (OFFICER_KEY + "{o").includes(special.getVisual().ch))) {
      special.visible = true
      this._level.draw(special.getXY()!)
      return
    }

    if (special && special instanceof Boulder) {
      let { ch } = special.getVisual()
      special.visible = true
      highlightColor = Color.multiply(highlightColor, [150, 150, 150])
      this._level.game.display.draw(x, y, ch, Color.toHex(highlightColor))
      return
    }

    // specials block the scanner (not log)
    let shardLocation = special && special instanceof CrystalShard
    if (!shardLocation && special && this._level.isSpecial(special) && !(special instanceof Log)) return
    if (!terrain) { return; }


    let { ch } = terrain.getVisual()

    if ("^.".includes(ch) && !shardLocation) {
      terrain.visible = true
      highlightColor = Color.multiply(highlightColor, [150, 150, 150])
      this._level.game.display.draw(x, y, ch, Color.toHex(highlightColor))

    } else if (terrain instanceof Crystal || shardLocation) {
      let key = shardLocation ? SHARD_KEY : ch
      let m = Color.randomize([100, 100, 100], 100)
      if (terrain.clearing) highlightColor = [50, 50, 50]
      highlightColor = Color.add(highlightColor, m)
      this._level.game.display.draw(x, y, key, Color.toHex(highlightColor))
    }

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
    return true
  }

  onDeactivate() {
    clearInterval(this._intervalID)
    this._r = this._initialR
    this.active = false
    return true
  }
}
