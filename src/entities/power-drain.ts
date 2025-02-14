import Entity from "../entity";
import Game from "../game";

const triggered = new Set()

export default class PowerDrain extends Entity {
  id: string

  constructor(game: Game, id: string) {
    super(game, { ch: ".", fg: "#430" });
    this.id = id
  }

  onInteract(entity: Entity): boolean {
    if (!triggered.has(this.id)) {
      triggered.add(this.id)
      this.getLevel().battery--
      this.getLevel().drawPower()

      if (this.getLevel().battery === 2) {
        this.getLevel().textBuffer.displayBox("My power cell is getting pretty low, I'll have to keep an eye on that.")
        return false
      }

      if (this.getLevel().battery === 0) {
        // should only happen near Intrepid while on EV
        if (!this.getLevel().ev.playerIsRiding) throw "Unexpected full power drain"

        this.getLevel().textBuffer.displayBox("I ran out of power! Guess it's back to going on foot again.", () => {
          if (!this.getLevel().ev.unload()) throw "Failed to unload EV on power drain"
        })
        return false
      }

    }
    return true
  }

}
