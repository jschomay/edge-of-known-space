import Entity from "../entity";
import Game from "../game";

let interactionCount = 0;

export default class Ship extends Entity {
  constructor(game: Game) {
    super(game, { ch: "{", fg: "white" });
  }

  onInteract(entity: Entity): boolean {
    if (interactionCount === 0) {
      this.getLevel()!.textBuffer.displayBox(`
That's strange, our shuttle is missing. No one else from the crew is in sight. I'm stranded and I'm alone. What's going on here?
`.trim())
    } else {
      this.getLevel()!.textBuffer.write("I can't go anywhere without finding the rest of the crew.")
    }
    interactionCount++;
    return false;
  }

}
