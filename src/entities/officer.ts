import Entity, { Visual } from "../entity";
import Game from "../game";

export const KEY = "X"

export default class Officer extends Entity {
  message: string

  constructor(game: Game, msg: string) {
    super(game, { ch: KEY, fg: "white" });
    this.visible = false
    this.message = msg
  }

  onInteract(entity: Entity): boolean {
    this.getLevel()!.textBuffer.displayBox(this.message, () => true)
    return false;
  }
}

export const BALTHAR = `
It's Dr. Balthar. She's dead.
---
The cause is unclear. If I had to guess, I'd say it happened fairly recently.

---
%c{#098}
::SCIENCE OFFICER BALTHAR PERSONAL LOGS::

These crystal formations are incredible! I've never seen anything like it. They seem to resonate with energy patterns beyond my scanner's operational range. This discovery could fundamentally change the limits of our technology as we know it.

I'm going to try to extract a sample...

::LOGS CORRUPTED::
`.trim()

export const ARGOS = `
Oh no, it's Argos, the security officer. He's crushed under a giant boulder. It looks like he got caught in a rockslide.
`.trim()

export const INTREPID1 = `
I found one of the crew of the Intrepid. She's been dead for a long time.

---
%c{#098}
::PERSONAL LOGS::

We're out of food.
---
%c{#098}
We're out of power. 
---
%c{#098}
We're out of luck.
`.trim()

export const INTREPID2 = `
Another Intrepid crew member, also long dead.

---
%c{#098}
::PERSONAL LOGS::

I still can't believe what happened. Yorq knew how volatile the crystals are, he would have known to be cautious. For such a large explosion to happen, he must have been extremely careless. All our research, gone. We'll be gone soon too now.
`.trim()


