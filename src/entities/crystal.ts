import Entity from "../entity";
import Game from "../game";
import * as ROT from "../../lib/rotjs";

export default class Crystal extends Entity {
  constructor(game: Game) {
    let ch = ROT.RNG.getUniform() > 0.5 ? "/" : "\\"
    let fg = ROT.RNG.getUniform() > 0.5 ? "#a0e" : "#0ae"
    super(game, { ch, fg: fg});
  }

  onInteract(entity: Entity): boolean {
    this.getLevel()!.textBuffer.write("Giant crystal formations grow like a dense forest, blocking out the light. It's impossible to safely pass through them.")
    return false;
  }

}
