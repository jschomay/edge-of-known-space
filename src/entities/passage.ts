import Entity, { Visual } from "../entity";
import Game from "../game";
import Cliff from "./cliff";

export default class Passage extends Cliff {
  scanned: boolean = false

  constructor(game: Game) {
    super(game);
    this.visible = false;
  }

  getVisual(): Visual {
    return {
      ch: this.scanned ? "-" : "=", fg: "#950"
    }
  }

  onInteract(entity: Entity): boolean {
    if (!this.scanned) {
      return super.onInteract(entity)
    } else {
      this.getLevel()!.textBuffer.write("There's a narrow passage here, I'm surprised I didn't notice it before.")
      this.remove()
      return true;
    }

  }

}
