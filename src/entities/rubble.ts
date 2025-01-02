import Entity, { Visual } from "../entity";
import Game from "../game";
import Cliff from "./cliff";

export default class Rubble extends Cliff {
  scanned: boolean = false

  constructor(game: Game) {
    super(game);
    this.visible = false;
  }

  getVisual(): Visual {
    return { ch: "=", fg: "#950" }
  }

  onInteract(entity: Entity): boolean {
    if (!this.scanned) {
      return super.onInteract(entity)
    } else {

      this.getLevel()!.textBuffer.write("There's a crack in the rock face here... I can push through.")
      this.remove()
      return false;
    }

  }

}
