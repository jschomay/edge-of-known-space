import Entity from "../entity";
import Game from "../game";

export default class Cliff extends Entity {
  static msg: string = "This is solid cliff face.  I can't pass."

  constructor(game: Game) {
    super(game, { ch: "=", fg: "#950" });
  }

  onInteract(entity: Entity): boolean {
    this.getLevel()!.textBuffer.write(Cliff.msg)
    return false;
  }

}
