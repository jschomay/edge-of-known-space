import Entity from "../entity";
import Game from "../game";

let interactionCount = 0;

export default class Ship extends Entity {
  constructor(game: Game) {
    super(game, { ch: "O", fg: "white" });
  }

  onInteract(entity: Entity): boolean {
    if (interactionCount === 0) {
      this.getLevel()!.textBuffer.displayBox(`
The ship's main power core has been damaged beyond repair. I'm stranded and I'm alone.
`.trim())
    } else {
      this.getLevel()!.textBuffer.write("Our ship's power core is still broken.")
    }
    interactionCount++;
    return false;
  }

}
