import * as ROT from "../../lib/rotjs";
import Entity, { Visual } from "../entity";
import XY from "../xy";
import Game from "../game";
import EVItem, { KEY as EVKey, COLOR as EVColor } from "../items/ev"
import Player from "./player";

export default class EV extends Entity {

  visible = false
  remote: EVItem | null = null
  direction: number = 0
  private _loaded: Entity | null = null
  private _keys: { [key: number]: number };

  constructor(game: Game) {
    super(game, { ch: "O", fg: "white" });

    this._keys = {};
    this._keys[ROT.KEYS.VK_UP] = 0;
    this._keys[ROT.KEYS.VK_W] = 0;
    this._keys[ROT.KEYS.VK_K] = 0;
    this._keys[ROT.KEYS.VK_RIGHT] = 1;
    this._keys[ROT.KEYS.VK_D] = 1;
    this._keys[ROT.KEYS.VK_L] = 1;
    this._keys[ROT.KEYS.VK_DOWN] = 2;
    this._keys[ROT.KEYS.VK_S] = 2;
    this._keys[ROT.KEYS.VK_J] = 2;
    this._keys[ROT.KEYS.VK_LEFT] = 3;
    this._keys[ROT.KEYS.VK_H] = 3;
    this._keys[ROT.KEYS.VK_A] = 3;
  }

  getVisual(): Visual {
    let loaded1 = "Θ"
    let loaded2 = "θ"
    let loaded3 = "0"
    return {
      ch: this._loaded ? loaded1 : "O",
      fg: this.inRange() ? "yellow" : "white"
    };
  }


  onInteract(player: Player): boolean {
    return this.load(player)
  }

  inRange() {
    return this.playerIsRiding() || (this.getLevel().activeItem === EVKey && this.remote?.isInRange(this.getXY()!))
  }

  isLoaded(): boolean {
    return !!this._loaded
  }

  playerIsRiding(): boolean {
    return this._loaded === this.getLevel().player
  }

  load(e: Entity): boolean {
    if (this._loaded) {
      this.getLevel().textBuffer.write(`The EV is already loaded. Press %c{${EVColor}}[${EVKey}]%c{} to unload it first.`)
      return false

    } else if (e === this.getLevel().player) {
      if (this.remote?.active) {
        this.getLevel().textBuffer.write("If I turn off the remote I can board the EV for manual control.")
        return false
      }

      this._loaded = e
      e.visible = false
      if (this.getLevel().activeItem) this.getLevel().deactivateItem(this.getLevel().activeItem!)
      this.getLevel().textBuffer.write(`Let's roll. Press %c{${EVColor}}[${EVKey}]%c{} to exit.`)
      return true

    } else {
      this._loaded = e
      this.getLevel().removeSpecialEntity(e)
      let name = e.name || "item"
      this.getLevel().textBuffer.write(`The ${name} has been loaded into the EV. Press %c{${EVColor}}[${EVKey}]%c{} to unload.`)
      return true
    }
  }

  unload() {
    let firstValidUnloadSpot = ROT.DIRS[4].find(([x, y]) => {
      let spot = this.getLevel().getEntityAt(this.getXY()!.plus(new XY(x, y)))
      if (!spot) return false
      if (this.getLevel().player.getXY()?.toString() === spot.getXY()!.toString()) return false
      let valid_exits = this.playerIsRiding() ? "." : "^."
      return valid_exits.includes(spot?.getVisual().ch || "XXX")
    })

    if (firstValidUnloadSpot) {
      let spot = this.getXY()!.plus(new XY(...firstValidUnloadSpot))

      if (this.playerIsRiding()) {
        this.getLevel().player.visible = true;
        this.getLevel().player.setPosition(spot)

      } else {
        this.getLevel().setSpecialEntity(this._loaded!, spot)
      }

      this._loaded = null
      this.getLevel().draw(spot)
      this.getLevel().draw(this.getXY()!)
      return true

    } else {
      let msg = this.playerIsRiding() ? "I can't safely get out of the EV here." : "There's no place to unload the EV here."
      this.getLevel().textBuffer.write(msg)
      return false
    }
  }

  // player delegates to here if remote is active or if riding EV
  _handleKey(keyCode: number): boolean {
    if (!(keyCode in this._keys)) { return false; }
    let action = this._keys[keyCode];
    // used for FOV direction
    this.direction = action * 2
    let dir = ROT.DIRS[4][action];
    let newXY = this.getXY()!.plus(new XY(dir[0], dir[1]));
    let entity = this.getLevel()!.getEntityAt(newXY);

    if (newXY.toString() === this.getLevel().player.getXY()?.toString()) {
      return this.load(this.getLevel().player)
    }

    if (!entity) {
      // unexplored area
      this.getLevel().textBuffer.write("I can't pilot the EV into an unknown space.")
      return false
    }

    if (!this.inRange()) {
      this.getLevel().textBuffer.write("The EV is out of range.")
      return false
    }

    let movingOutOfRange = !this.playerIsRiding() && !this.remote?.isInRange(newXY)
    if (movingOutOfRange) {
      this.getLevel().textBuffer.write("I can't go that way, it's out of range.")
      return false
    }

    if (entity.onInteract(this)) {
      this.moveTo(newXY);
    }

    if (!this.getLevel().textBuffer.showing) {
      // draw over text buffer, so skip if showing
      this.getLevel().updateFOV()
    }

    return true;
  }

  moveTo(xy: XY) {
    let oldPos = this.getXY();
    this.setPosition(xy)
    // bring player along
    if (this.playerIsRiding()) this.getLevel().player.setPosition(xy)
    // make sure initial hidden terrain under EV gets drawn
    let terrain = this.getLevel().getEntityAt(oldPos!, false, true);
    if (terrain) {
      terrain.visible = true
    }
    this.getLevel()!.draw(oldPos!);
    this.getLevel()!.draw(xy);
  }

}



