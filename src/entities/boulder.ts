import Entity from "../entity";
import Game from "../game";
import EV from "./ev";

export default class Boulder extends Entity {
  constructor(game: Game) {
    super(game, { ch: "#", fg: "#530" });
    this.visible = false
  }

  onInteract(entity: Entity): boolean {
    if (entity === this.getLevel().player) {
      this.getLevel()!.textBuffer.write("This is a large boulder, I can't move it.")
      return false
    } else if (entity === this.getLevel().ev) {
      return (entity as EV).load(this)
    }
    return false
  }

}
