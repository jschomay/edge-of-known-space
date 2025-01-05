import MainLevel from "../level"
import Item from "."
import Bridge from "../entities/bridge";
import Chasm from "../entities/chasm";
import XY from "../xy";

export default class BridgeItem implements Item {
  key: string = "4"
  name: string = "Bridge"
  color: string = "purple"
  active: boolean = false

  private _level: MainLevel
  private _deployed: boolean = false
  private _maxLength: number
  private _timeoutId: number | null = null
  private _deploySpeed: number

  getFOV() { return null }

  constructor(level: MainLevel) {
    this._level = level
    this._maxLength = 2
    this._deploySpeed = 300
  }

  _getChasmSize(dir: XY) {
    let chasmSize = 0
    let target = this._level.getEntityAt(this._level.player.getXY()!.plus(dir))
    while (target && target instanceof Chasm) {
      chasmSize++
      target = this._level.getEntityAt(target.getXY()!.plus(dir))
    }
    if (!target) {
      // can't see other side
      return 999
    } else {
      // found ground
      return chasmSize
    }
  }

  _deploy(dir: XY) {
    // TODO lock game loop
    let deploy = (i: number, xy: XY) => {
      let isGround = this._level.getEntityAt(xy)?.getVisual().ch === "."
      this._level.setSpecialEntity(new Bridge(this._level.game, { suspended: !isGround }), xy)
      if (isGround) {
        this._timeoutId = null
        return
      }

      this._timeoutId = setTimeout(() => deploy(i + 1, xy.plus(dir)), this._deploySpeed);
    }
    // looks better with no delay before drawing 2nd bridge segment so render first one immediately
    this._level.setSpecialEntity(new Bridge(this._level.game, { suspended: false }), this._level.player.getXY()!)
    deploy(1, this._level.player.getXY()!.plus(dir))
  }

  _retract() {
    // TODO lock game loop
    let player = this._level.player.getXY()!
    let bridgeToRight = this._level.getEntityAt(player.plus(new XY(1, 0))) instanceof Bridge
    let dir = bridgeToRight ? new XY(1, 0) : new XY(-1, 0)

    let bridgeEntites = [this._level.getEntityAt(player)]
    let e = this._level.getEntityAt(player.plus(dir))!
    while (e instanceof Bridge) {
      bridgeEntites.push(e)
      e = this._level.getEntityAt(e.getXY()!.plus(dir))!
    }

    let retract = () => {
      this._level.removeSpecialEntity(bridgeEntites.pop()!)
      if (bridgeEntites.length > 0) {
        this._timeoutId = setTimeout(retract, this._deploySpeed);
      } else {
        this._timeoutId = null
      }
    }
    retract()
  }

  onActivate() {
    // always deactivate
    this._level.deactivateItem(this.key)
    if (this._timeoutId) return

    let playerXY = this._level.player.getXY()!
    let entityUnderPlayer = this._level.getEntityAt(playerXY)!
    let right = new XY(1, 0)
    let left = new XY(-1, 0)
    let chasmToRight = this._getChasmSize(right)
    let chasmToLeft = this._getChasmSize(left)

    let msg = ""
    if (this._deployed) {
      if (!(entityUnderPlayer instanceof Bridge)) {
        msg = "I need to retrieve the bridge if I want to use it again."

      } else if (entityUnderPlayer.suspended) {
        msg = "I can't retract the bridge while I'm on the middle of it."

      } else {
        this._retract()
        this._deployed = false
      }

    } else {
      // not deployed
      if (!(chasmToRight || chasmToLeft)) {
        msg = "I need to be near a river to deploy the bridge."

      } else if (chasmToRight == 999 || chasmToLeft == 999) {
        msg = "I can't see the other side!"
      } else if ((chasmToRight > this._maxLength || chasmToLeft > this._maxLength)) {
        msg = "The river here is too wide for the bridge."

      } else {
        this._deploy(chasmToRight ? right : left)
        this._deployed = true
      }
    }

    if (msg) this._level.textBuffer.write(msg)
  }

  onDeactivate() { }
}
