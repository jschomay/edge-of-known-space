import * as ROT from "../../lib/rotjs";
import XY from "../xy";
import FOV from "../../lib/rotjs/fov/fov";
import { LightPassesCallback, VisibilityCallback } from "../../lib/rotjs/fov/fov";
import MainLevel from "../level"
import Item from "."
import Log from "../entities/log";

const key = "1"
export default class TerminalItem implements Item {
  key: string = key
  name: string = "Terminal"
  color: string = "green"
  active: boolean = false

  private _logs: string[] = []
  private _level: MainLevel
  private _fov: FOV;
  private _r: number = 1
  private _intervalID?: number
  private _initR = 1;
  private _FOVGrawRate = 1
  private _FOVMaxRadius: number = 10
  private _FOVSpeed = 30
  private _FOVWidth = 2

  static getKey() { return key }

  constructor(level: MainLevel) {
    this._level = level
    this.setPower()
    // use RecursiveShadowcasting for circular fov
    this._fov = new ROT.FOV.DiscreteShadowcasting(this._FOVLightPasses, { topology: 4 })
  }

  setPower() {
    this._FOVMaxRadius = { 1: 10, 2: 18, 3: 24, 4: 38 }[this._level.powerLevel] || 10
  }

  getFOV() {
    return { r: this._r || 1, fov: this._fov, cb: this._FOVIlluminate };
  }

  _FOVLightPasses: LightPassesCallback = (x, y) => {
    return true
  }


  _FOVIlluminate: VisibilityCallback = (x, y, r, visibility) => {
    let xy = new XY(x, y)
    let e = this._level.getEntityAt(xy, true, true)
    let color = this._level.powerLevel > 1 ? "#808" : "#880"
    if (!e) { return; }

    // Use this for circular fov
    // let preciseR = e.getXY()!.dist(this._level.player.getXY()!)
    if (this._r - r < this._FOVWidth) {
      if (e instanceof Log && e.level <= this._level.powerLevel) {
        e.visible = true
      } else {
        let multplier = 190 * this._FOVMaxRadius / r
        let fg = ROT.Color.multiply(ROT.Color.fromString(color), [multplier, multplier, multplier]);
        this._level.game.display.draw(x, y, "+", ROT.Color.toHex(fg));
      }
    } else {
      this._level.draw(xy)
    }
  }

  readLog(log: string) {
    this._logs.push(log)
    this._level.textBuffer.displayBox(log)
  }

  onActivate() {
    // TODO lock the game loop so the player can't move
    this.active = true
    this._r = this._initR
    this._intervalID = setInterval(() => {
      this._r += this._FOVGrawRate
      if (this._r >= this._FOVMaxRadius) {
        this._level.deactivateItem(this.key)
      }
      this._level.updateFOV()
    }, this._FOVSpeed)
    return true
  }

  onDeactivate() {
    clearInterval(this._intervalID)
    this.active = false
    return true
  }
}
