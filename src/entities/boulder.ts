import Entity from "../entity";
import Game from "../game";
import EV from "./ev";

export default class Boulder extends Entity {
  name = "The boulder"

  constructor(game: Game) {

    super(game, { ch: "#", fg: "#962" });
    this.visible = false
  }

  onInteract(entity: Entity): boolean {
    if (entity === this.getLevel().player) {
      this.getLevel()!.textBuffer.write("This is a large boulder, I can't move it.")
    } else if (entity === this.getLevel().ev) {
      (entity as EV).load(this)
    }
    return false
  }

}
