import Entity from "../entity";
import Game from "../game";

let interactionCount = 0;

export default class Intrepid extends Entity {
  constructor(game: Game) {
    super(game, { ch: "o", fg: "white" });
  }

  onInteract(entity: Entity): boolean {
    if (interactionCount === 0) {
      this.getLevel()!.textBuffer.displayBox(`
I found ship wreckage...
---
It's the Interpid!
`.trim())
    } else {
      this.getLevel()!.textBuffer.write("The Intrepid is destroyed beyond repair.")
    }
    interactionCount++;
    return false;
  }

}
