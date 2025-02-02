import { FOV } from "../../lib/rotjs";
import Entity from "../entity";
import Game from "../game";
import XY from "../xy";


export default class Log extends Entity {
  private log: string
  private discovered = false
  private onDiscover: (entity: Entity) => void

  constructor(game: Game, data: { text: string, onDiscover: (entity: Entity) => void }) {
    super(game, { ch: "+", fg: "yellow" });
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

Distress signal detected from deep-space research vessel INTREPID (DSRV-890).

Primary objective: Locate and recover INTREPID vessle and crew.  
---
::PERSONEL MANIFEST::  

- Commanding Officer Lo  
- Science Officer Balthar  
- Engineering Officer Dax  
- Security Officer Hanes (reassignment)
- Security Officer Argos  
---
::CRITICAL MISSION LOGS::  

...
5671008 - Atmospheric entry initiated; ALERT: velocity exceeds safe parameters.  
5671147 - INTREPID emergency beacon detected.
5671203 - Cryosleep pods A, D, E: activation sequence initiated.  
5672724 - Reserve power systems engaged.  
5679114 - Cryosleep pod C: activation sequence initiated.  
5682989 - WARNING: Reserve power levels at 50%.  
5684026 - Emergency override triggered: Cryosleep pod B activated.  
5684035 - CRITICAL WARNING: Reserve power depleted. System shutdown imminent.  


::END LOGS::
`.trim(),
  onDiscover: (entity: Entity) => entity.getLevel().game.display.draw(90, 30, "!", "red")
}

export const SCIENCE_OFFICER_FIRST = {
  text: `
::SCIENCE OFFICER BALTHAR LOG BEACON::

Something went wrong. I awoke but Lo and the sec goons were gone.  Why wouldn't they wake us?
Dax is still out. I debated waking him, but there's too many unknowns, I determined it would be safer to locate the others and scan for dangers first.
---
I'm detecting strong abnormal energy signatures. I will attempt to investigate.
`.trim(),
  onDiscover: (entity: Entity) => null
}

export const LO_BRIDGE = {
  text: `
:COMMANDING OFFICER LO TRANSMISSION::

The Intrepid's on the other side of this river. Hanes, set up the energy bridge, let's get this over with.
---
Dammit, my torchlamp fell off somewhere. Never mind, we'll get it on the way back.
`.trim(), onDiscover: (entity: Entity) => null
}

export const LO_EXPLORE = {
  text: `
:COMMANDING OFFICER LO TRANSMISSION::

Argos, take EV2 and explore the area, make sure we're alone. Keep me posted.
Hanes, you're with me.
We'll rendezvous back at the ship and awake the others.'
`.trim(), onDiscover: (entity: Entity) => null
}


export const LO_REPORT = {
  text: `
:COMMANDING OFFICER LO TRANSMISSION::

Argos, report, where the hell are you?
`.trim(), onDiscover: (entity: Entity) => null
}

export const ARGOS_UNSTABLE = {
  text: `
:SECURITY OFFICER ARGOS TRANSMISSION::

There's definitely something up here, but it's slow going. The ground is unstable.
`.trim(), onDiscover: (entity: Entity) => null
}

// export const ARGOS = {
//   text: `I can see for miles and miles and miles...`,
//   onDiscover: (entity: Entity) => {
//     const fov = new FOV.RecursiveShadowcasting(() => true, { topology: 8 })
//     const speed = 50
//     const { x, y } = entity.getLevel()!.getSize()
//     const levelHeight = y
//     let r = 0
//     const intervalId = setInterval(() => {
//       r += 1
//       if (r > Math.max(x, y)) clearInterval(intervalId)

//       fov.compute(entity.getXY()!.x, entity.getXY()!.y, r, (x, y, r, visible) => {
//         if (y < 3 || y > levelHeight - 2) return
//         let xy = new XY(x, y)
//         let terrain = entity.getLevel()!.getEntityAt(xy, false, true)
//         let special = entity.getLevel()!.getEntityAt(xy, true, false,)
//         if (terrain) terrain.visible = true
//         if (special) special.visible = true
//         entity.getLevel().draw(xy)
//       })
//     }, speed)
//   }
// }
