import Entity, { Visual } from "../entity";
import Game from "../game";


export default class Officer extends Entity {
  message: string

  constructor(game: Game, message: string) {
    super(game, { ch: "?", fg: "yellow" });
    this.visible = false
    this.message = message
  }

  getVisual() {
    return this.visible
      ? { ch: "?", fg: "yellow" }
      : { ch: "x", fg: "yellow" }
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

export const BARNES = `
BARNES. Dead, rockslide.
`
export const TODO = `TODO`
