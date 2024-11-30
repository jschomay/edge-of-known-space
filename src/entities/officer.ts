import Entity from "../entity";
import Game from "../game";


export default class Officer extends Entity {
  message: string

  constructor(game: Game, message: string) {
    super(game, { ch: "x", fg: "#bbb" });
    this.visible = false
    this.message = message
  }

  onInteract(entity: Entity): boolean {
    this.getLevel()!.textBuffer.displayBox(this.message, () =>
      true
    )
    return false;
  }
}

export const BALTHAR = `
It's Balthar.  She's dead.

TO BE CONTINUED...

--END OF CONTENT--
`.trim()
