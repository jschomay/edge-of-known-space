import Entity from "../entity";
import Game from "../game";
import EV from "./ev";

export default class Rocky extends Entity {
  constructor(game: Game) {
    super(game, { ch: ",", fg: "#540" });
  }

  onInteract(entity: Entity): boolean {
    if (entity instanceof EV) return true;

    this.getLevel()!.textBuffer.write("The ground here is rocky and steep, I can't proceed by foot.")
    return false;
  }

}
