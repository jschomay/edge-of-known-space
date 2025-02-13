import Entity, { Visual } from "../entity";
import Game from "../game";
import EV from "./ev";

export const KEY = "&"

export default class Lo extends Entity {
  concious: boolean = true
  visible = false
  name = "Commander Lo"

  constructor(game: Game) {
    super(game, { ch: KEY, fg: "yellow" });
  }

  onInteract(entity: Entity): boolean {
    if (this.concious) {
      this.getLevel().loDiscovered = true
      this.getLevel()!.textBuffer.displayBox(dialog, () => true)
      this.concious = false
    } else if (entity === this.getLevel().ev) {
      (entity as EV).load(this)
    } else if (entity === this.getLevel().player) {
      this.getLevel()!.textBuffer.write("I have to get him back to the ship, but he's too heavy for me to carry.")
    }
    return false;
  }
}


const dialog = `
It's Commander Lo! He's been shot. He's barely conscious, but he is alive.
---
"Dax... I'm glad to see you. Where is Balthar and Argos? Never mind, I need you to listen carefully."
---
"This was more than a salvage mission. The Intrepid crew were working on classified research and I was under confidential orders to retrieve it. Per security clearance protocols, I couldn't wake you until assessing the situation."
---
"It doesn't matter now. Hanes turned on us. When we recovered whatever research we could find, he shot me and left me to die. He stole the research and took our shuttle."
---
"That information in the wong hands is bad news. We need to get back home and warn command."
---
"At least one thing went our way -- I found something in this grove. A chunk of these crystals. We can bring that back. Dax..."
---
He slumps over.
---
...
---
He's unconscious. I have to get thim back to the ship's med bay.
---
Hang in there Commander.
`
