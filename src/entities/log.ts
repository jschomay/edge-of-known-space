import Entity from "../entity";
import Torch from "../entities/torch"
import Game from "../game";
import XY from "../xy";


export default class Log extends Entity {
  private log: string
  private discovered = false
  private onDiscover: (entity: Entity) => void

  constructor(game: Game, data: { text: string, onDiscover: (entity: Entity) => void }) {
    super(game, { ch: "?", fg: "yellow" });
    this.visible = false
    this.log = data.text
    this.onDiscover = data.onDiscover
  }

  onInteract(entity: Entity): boolean {
    let logs = this.log.split("---")
    let showLog = () => {
      this.getLevel().textBuffer.displayBox("%c{#098}" + logs.shift(), () => {
        if (logs.length > 0) {
          setTimeout(showLog.bind(this), 0);
        } else {
          if (!this.discovered) this.onDiscover(this)
          this.discovered = true
          this.setVisual({ ch: '+', fg: "#aa0" })
          // this.remove()
        }
      })
    }
    showLog()
    return false;
  }

}

export const EMPTY_SHIP = {
  text: `
::RECOVERED LOGS::  

::MISSION OBJECTIVE::

Distress signal detected from deep-space research vessel INTREPID (DSRV-890). Deployed to the edge of known space for priority research of potential new energy resource.

Primary objective: locate INTREPID and recover classified research data.  
---
::CREW MANIFEST::  

- Commanding Officer: Lo  
- Science Officer: Balthar  
- Engineering Officer: Dax  
- Security Officer: Hanes  
- Security Officer: Argos (reassignment logged)  
---
::MISSION LOGS (LEVEL 5+)::  

...
5671008 - Atmospheric entry initiated; ALERT: velocity exceeds safe parameters.  
5671147 - INTREPID emergency beacon detected to the Southeast.
5671203 - Cryosleep pods A, D, E: activation sequence initiated.  
5672724 - Reserve power systems engaged.  
5679114 - Cryosleep pod C: activation sequence completed.  
5682989 - WARNING: Reserve power levels at 50%.  
5684026 - Emergency override triggered: Cryosleep pod B activated.  
5684035 - CRITICAL WARNING: Reserve power depleted. System shutdown imminent.  


::END LOGS::
`.trim(),
  onDiscover: (entity: Entity) => entity.getLevel().game.display.draw(90, 30, "!", "red")
}

export const SCIENCE_OFFICER_FIRST = {
  text: `
::SCIENCE OFFICER BALTHAR LOGS::

Something went wrong. I woke up and Lo and the sec goons were gone.  I debated waking Dax, but we don't know what happened to the INTREPID's crew.  It may be safer to locate the others and scan for dangers first.
---
I found footprints heading East.  I'll follow them momentarily, but I want to check out some strong energy signatures I'm reading to the West.
---
These crystal formations are incredible!  I've never seen anything like it.  I'm going to take a closer look.
`.trim(),
  onDiscover: (entity: Entity) => null
}

export const LO_BRIDGE = {
  text: `
:COMMANDING OFFICER LO LOGS::

The INTREPID's on the other side of this chasm. Hanes, grab the extension bridge, we've got to hurry. Let's go, let's go!

Dammit Agros, where's that torch?
`.trim(), onDiscover: (entity: Entity) => null
}

export const TODO = {
  text: `
::TODO::
`, onDiscover: (entity: Entity) => null
}
