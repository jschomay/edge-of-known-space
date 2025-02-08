import Entity, { Visual } from "../entity";
import Game from "../game";
import EV from "./ev";

export const KEY = "Z"

export default class Lo extends Entity {
  concious: boolean = true
  visible = false
  name = "Commander Lo"

  constructor(game: Game) {
    super(game, { ch: KEY, fg: "yellow" });
  }

  onInteract(entity: Entity): boolean {
    if (this.concious) {
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
"This was more than a salvage mission. I was under confidential orders to retrieve the critical reseach the Intrepid crew was working on. Per security clearance protocols, I couldn't wake you until assessing the situation."
---
"It doesn't matter now. Hanes turned on us. When we recovered whatever research we could find, he shot me. He stole it and took our shuttle. There's no finding him now."
---
"That information in the wong hands is catastrophic. Dax, we need to get back home and warn them."
---
"Wait... I found something in this grove. A crystal shard. At least we can bring that back. Dax..."
---
He slumps over.
---
...
---
He's unconscious. I can't just leave him, I have to bring him back with me. But he's too heavy in his suit to move without injuring him, I'll have to load him in the Ev.""
---
Hang in there Commander.
`
