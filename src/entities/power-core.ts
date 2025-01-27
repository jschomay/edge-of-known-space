import Entity from "../entity";
import Game from "../game";

let interactionCount = 0;

export default class PowerCore extends Entity {
  constructor(game: Game) {
    super(game, { ch: "8", fg: "orange" });
  }

  onInteract(entity: Entity): boolean {
    if (interactionCount === 0) {
      this.getLevel()!.textBuffer.displayBox(`
The Intrepid's power core is damaged, but I think I can salvage it. If I can find some way to get it back to our ship, I can get back home."
`.trim())
    } else {
      this.getLevel()!.textBuffer.write("The power core is too heavy for me to lift on my own.")
    }
    interactionCount++;
    return false;
  }

}
