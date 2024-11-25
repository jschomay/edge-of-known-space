import Entity from "../entity";
import Game from "../game";
import * as ROT from "../../lib/rotjs";

export default class Crystal extends Entity {
  clearing: boolean

  constructor(game: Game, clearing: boolean = false, visible: boolean = false) {
    let ch = ROT.RNG.getUniform() > 0.5 ? "/" : "\\"
    let fg = ROT.RNG.getUniform() > 0.5 ? "#a0e" : "#0ae"
    super(game, { ch, fg: fg });
    this.clearing = clearing
    this.visible = visible
  }

  onInteract(entity: Entity): boolean {
    if (!this.clearing) {
      this.getLevel()!.textBuffer.write("Giant crystal formations grow like a dense forest, blocking out the light. It's impossible to safely pass through them.")
    }
    return this.clearing && this.visible
  }

}
