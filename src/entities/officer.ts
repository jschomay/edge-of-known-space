import Entity, { Visual } from "../entity";
import Game from "../game";


export default class Officer extends Entity {
  message: string

  constructor(game: Game, msg: string) {
    super(game, { ch: "x", fg: "white" });
    this.visible = false
    this.message = msg
  }

  onInteract(entity: Entity): boolean {
    this.getLevel()!.textBuffer.displayBox(this.message, () => true)
    return false;
  }
}

export const BALTHAR = `
It's Balthar.  She's dead.

TO BE CONTINUED...

--END OF CONTENT--
`.trim()

export const ARGOS = `
ARGOS. Dead, rockslide.
`.trim()

export const LO = `
x
`.trim()

export const INTREPID1 = `
x
`.trim()

export const INTREPID2 = `
x
`.trim()
