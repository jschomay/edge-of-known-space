import Entity from "../entity";
import Game from "../game";

export default class Cliff extends Entity {
  constructor(game: Game) {
    super(game, { ch: "=", fg: "#950" });
  }

  onInteract(entity: Entity): boolean {
    this.getLevel()!.textBuffer.write("This is solid cliff face.  I can't pass.")
    return false;
  }

}
