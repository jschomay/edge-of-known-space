import Entity from "../entity";
import Game from "../game";
import { map1 } from "../level-data";

let interactionCount = 0;

export default class Ship extends Entity {
  constructor(game: Game) {
    super(game, { ch: "o", fg: "white" });
  }

  onInteract(entity: Entity): boolean {
    if (interactionCount === 0) {
      this.getLevel()!.textBuffer.displayBox("The ship's main power core has been damaged beyond repair.  That explains the reserve power, but it should have lasted for months.  What happened here?  How long was I left behind?  How will I get home? I need to try to find the rest of my crew.  I'll need to venture further out...",
        () => this.getLevel().expandMap(map1))
    } else {
      this.getLevel()!.textBuffer.write("The power core is broken. My crew is gone. What am I going to do?")
    }
    interactionCount++;
    return false;
  }

}
