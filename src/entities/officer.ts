import Entity, { Visual } from "../entity";
import Game from "../game";


export default class Officer extends Entity {
  message: string

  constructor(game: Game, name: string) {
    let initial = name[0]
    super(game, { ch: "x", fg: "white" });
    this.visible = false
    this.message = MESSAGES[name] || "TODO"
  }

  onInteract(entity: Entity): boolean {
    this.getLevel()!.textBuffer.displayBox(this.message, () =>
      true
    )
    return false;
  }
}

const MESSAGES: Record<string, string> = {}
MESSAGES["Balthar"] = `
It's Balthar.  She's dead.

TO BE CONTINUED...

--END OF CONTENT--
`.trim()

MESSAGES["Barnes"] = `
BARNES. Dead, rockslide.
`
