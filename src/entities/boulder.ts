import Entity from "../entity";
import Game from "../game";

export default class Boulder extends Entity {
  constructor(game: Game) {
    super(game, { ch: "#", fg: "#530" });
    this.visible = false
  }

  onInteract(entity: Entity): boolean {
    this.getLevel()!.textBuffer.write("This is a large boulder, I can't move it.")
    return false;
  }

}
