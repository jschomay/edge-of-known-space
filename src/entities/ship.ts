import Entity from "../entity";
import Game from "../game";

export default class Ship extends Entity {

  constructor(game: Game) {
    super(game, { ch: "o", fg: "white" });
  }


  act() { /* FIXME */ }

  isTraversable(entity: Entity): boolean {
    this.getLevel()!.textBuffer.write("My ship!")
    return false;
  }

}
