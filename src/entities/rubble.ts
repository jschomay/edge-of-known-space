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
    const ch = this.scanned ? "%" : "="
    return { ch: ch, fg: "#950" }
  }

  onInteract(entity: Entity): boolean {
    if (!this.scanned) {
      return super.onInteract(entity)
    } else {

      this.getLevel()!.textBuffer.write("This looks like loose rubble. I can clear it away.")
      this.remove()
      return false;
    }

  }

}
