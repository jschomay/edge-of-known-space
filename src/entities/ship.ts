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
The ship's main power core has been damaged. And the shuttle is missing too. No one else from the crew is in sight. I'm stranded and I'm alone. What's going on here?
`.trim())
    } else {
      this.getLevel()!.textBuffer.write("Our ship's power core is still broken.")
    }
    interactionCount++;
    return false;
  }

}
