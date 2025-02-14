import EndScreen from "../end-screen";
import Entity from "../entity";
import Game from "../game";
import EV from "./ev";

let interactionCount = 0;

export default class Ship extends Entity {
  constructor(game: Game) {
    super(game, { ch: "{", fg: "white" });
  }

  onInteract(entity: Entity): boolean {
    if (entity instanceof EV) {
      if (entity.carryingLo()) {
        // messy, but good enough for the ending
        this.getLevel().ev._loaded = null
        entity.remove()
        this.getLevel()!.textBuffer.write("Lo is safely loaded back on the ship. We're ready to go home!")
        let remoteKey = this.getLevel().activeItem!
        this.getLevel().deactivateItem(remoteKey)
        delete this.getLevel()._inventory[remoteKey]
        this.getLevel()._drawInventory()
        this.getLevel().ev.remote.active = false
        this.getLevel().loOnShip = true
        return false
      }
      this.getLevel()!.textBuffer.write("I'm not ready to dock the EV yet.")
      return false;
    }

    if (this.getLevel().loDiscovered && !this.getLevel().loOnShip) {
      this.getLevel()!.textBuffer.write("I won't leave until I get Commander Lo back on board.")
      return false
    }
    if (this.getLevel().loDiscovered && this.getLevel().loOnShip) {
      this.getLevel().textBuffer.displayBox(`
Lo is healing in the med bay. All systems ready. Let's go home!
---
These crystals are doing something to the engines I've never seen before. The readout says it will only take a 2 months to get back.
---
I think this time I'll stay awake.
`.trim(), () => {
        this.game.switchLevel(new EndScreen(this.game))
      })
      return false
    }

    if (interactionCount === 0) {
      this.getLevel()!.textBuffer.displayBox(`
The ship appears to be fully functional. But our shuttle is missing. What happened while I was out?
`.trim())
      interactionCount++;
      return false
    }


    this.getLevel()!.textBuffer.write("I can't go anywhere without finding the rest of the crew.")
    return false;
  }

}
