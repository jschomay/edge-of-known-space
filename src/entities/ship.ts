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
The ship appears to be fully functional. But our shuttle is missing. What happened while I was out?
`.trim())
    } else {
      this.getLevel()!.textBuffer.write("I can't go anywhere without finding the rest of the crew.")
    }
    interactionCount++;
    return false;
  }

}
