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

    } else if (this.getLevel().ev.playerIsRiding()) {
      this.getLevel()!.textBuffer.write("There's something here, but I have to get out of the EV to check it out.")
      return false

    } else {
      this.getLevel()!.textBuffer.write("There's a narrow passage in the cliffs here.")
      this.remove()
      return true;
    }

  }

}
