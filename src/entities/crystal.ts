import Entity from "../entity";
import Game from "../game";
import { KEY as torchKey } from "../items/torch";
import * as ROT from "../../lib/rotjs";

export default class Crystal extends Entity {
  clearing: boolean
  dense: boolean

  constructor(game: Game, clearing: boolean = false, dense: boolean = false) {
    let ch = ROT.RNG.getUniform() > 0.5 ? "/" : "\\"
    if (dense) ch = "|"
    let fg = ROT.RNG.getUniform() > 0.5 ? "#a0e" : "#0ae"
    super(game, { ch, fg: fg });
    this.clearing = clearing
    this.dense = dense
  }

  onInteract(entity: Entity): boolean {
    const torchOn = this.getLevel().activeItem === torchKey
    if (this.getLevel().ev.playerIsRiding()) {
      this.getLevel()!.textBuffer.write("These crystals are so dense, I can't get through on the EV.")
      return false
    }

    let denseMsg = "These crystal formations are even denser, it's impossible to pass through without more light."
    if (this.dense && this.getLevel().powerLevel === 1) {
      this.getLevel()!.textBuffer.write(denseMsg)
      return false
    }

    if (!torchOn) {
      let msg = this.dense
        ? denseMsg
        : "Giant crystal formations grow like a dense forest, blocking out the light. It's impossible to safely pass through them."
      this.getLevel()!.textBuffer.write(msg)
    } else if (!this.clearing) {
      this.getLevel()!.textBuffer.write("Solid crystals block the path.")
    }

    return this.clearing && torchOn
  }
}
