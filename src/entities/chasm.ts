import Entity from "../entity";
import Game from "../game";

export default class Chasm extends Entity {

  constructor(game: Game) {
    super(game, { ch: " ", fg: "white" });
  }

  onInteract(entity: Entity): boolean {
    this.getLevel()!.textBuffer.write("A chasm has split the ground in half. It is so deep I can't see the bottom. I'll need to find some other way around.")
    return false;
  }

}
