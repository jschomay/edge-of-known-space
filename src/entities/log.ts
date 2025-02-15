import { FOV } from "../../lib/rotjs";
import Entity from "../entity";
import Game from "../game";
import XY from "../xy";


export default class Log extends Entity {
  level = 1
  private log: string
  private discovered = false
  private onDiscover: (entity: Entity) => void

  constructor(game: Game, data: { text: string, onDiscover: (entity: Entity) => void }, level = 1) {
    let color = level === 1 ? "yellow" : "#d0d"
    super(game, { ch: "+", fg: color });
    this.level = level
    this.visible = false
    this.log = data.text
    this.onDiscover = data.onDiscover
  }

  onInteract(entity: Entity): boolean {
    this.getLevel().textBuffer.displayBox(this.log, () => {
      if (!this.discovered) this.onDiscover(this)
      this.discovered = true
      let color = this.level === 1 ? "#aa0" : "#838"
      this.setVisual({ ch: '+', fg: color })
      this.getLevel().draw(this.getXY()!)
      // this.remove()
    })
    return false;
  }

}

export const EMPTY_SHIP = {
  text: `
%c{#098}
::RECOVERED LOGS::  

::MISSION OBJECTIVE::

Distress signal detected from deep-space research vessel INTREPID (DSRV-890).

Primary objective: Locate and recover INTREPID vessel and crew.  
---
%c{#098}
::PERSONNEL MANIFEST::  

- Commanding Officer Lo  
- Science Officer Balthar  
- Engineering Officer Dax  
- Security Officer Hanes (reassignment)
- Security Officer Argos  
---
%c{#098}
::CRITICAL MISSION LOGS::  

...
5671008 - Atmospheric entry initiated; ALERT: velocity exceeds safe parameters.  
5671147 - INTREPID emergency beacon detected.
5671203 - Cryosleep pods A, D, E activated.
5672724 - Shuttle undocking process initiated.
5679007 - Emergency cryospleep pod activation sequence initiated.
5679114 - Cryosleep pod C: activated.
5684026 - Cryosleep pod B: activated.  


::END LOGS::
`.trim(),
  onDiscover: (entity: Entity) => null
}

export const SCIENCE_OFFICER_FIRST = {
  text: `
%c{#098}
::SCIENCE OFFICER BALTHAR LOG BEACON::

Something went wrong. I awoke but Lo and the sec goons were gone.  Why wouldn't they wake us?
---
%c{#098}
Dax is still out. I debated waking him, but there's too many unknowns, I determined it would be safer to locate the others and scan for dangers first.
---
%c{#098}
I'm detecting unusually strong energy signatures near by. I will attempt to investigate.
`.trim(),
  onDiscover: (entity: Entity) => null
}

export const LO_BRIDGE = {
  text: `
%c{#098}
:COMMANDING OFFICER LO TRANSMISSION::

The Intrepid's on the other side of this river. Hanes, set up the energy bridge, let's get this over with.
---
%c{#098}
Dammit, my torchlamp fell off somewhere. Never mind, we'll get it on the way back.
`.trim(), onDiscover: (entity: Entity) => null
}

export const LO_EXPLORE = {
  text: `
%c{#098}
::COMMANDING OFFICER LO TRANSMISSION::

Argos, take EV2 and explore the area, make sure we're alone. Keep me posted. We'll rendezvous back at the ship and awake the others.'
---
Hanes, you're with me.
`.trim(), onDiscover: (entity: Entity) => null
}


export const LO_REPORT = {
  text: `
%c{#098}
::COMMANDING OFFICER LO TRANSMISSION::

Argos, report, where the hell are you?
`.trim(), onDiscover: (entity: Entity) => null
}

export const ARGOS_UNSTABLE = {
  text: `
%c{#098}
::SECURITY OFFICER ARGOS TRANSMISSION::

There's definitely something up here, but it's slow going. The ground is unstable.
`.trim(), onDiscover: (entity: Entity) => null
}

export const YORQ = {
  text: `
I picked up a decaying log signal. This one happened a while ago.
---
%c{#b80}
::WARNING BEACON::

We came in search of efficient power. What we found was beyond imagination.
---
%c{#b80}
The power of these crystals is too great. Humanity cannot be trusted.
---
%c{#b80}
On behalf of the Let Stars Be activist group, I Yorq, now commit this research back to the stars. Goodbye all.
`.trim(), onDiscover: (entity: Entity) => null
}

export const HANES = {
  text: `
%c{#b80}
::LOW POWER SUBSPACE TRANSMISSION::

This is Hanes. I got the data. I am en route now via class M2 shuttle to the agreed coordinates. Be ready.
`.trim(), onDiscover: (entity: Entity) => null
}

export const DENSE = {
  text: `
I picked up a decaying log signal. This one happened a while ago.
---
%c{#b80}
::INTREPID RESEARCH CHANNEL BROADCAST::

I'm exploring further down the range. The crystals here are even denser. I can't wait to bring these new readings back to the lab.
`.trim(), onDiscover: (entity: Entity) => null
}

export const DISTRESS = {
  text: `
I picked up a decaying log signal. This one happened a while ago.
---
%c{#b80}
::DISTRESS SIGNAL::

This is Science Officer Jessup of the INTREPID DSRV-890. There's been an accident.
---
%c{#b80}
Our ship is destroyed, one member of the crew is dead. We are stranded.
---
%c{#b80}
We're stranded at the edge of known space. Requesting assistance.
---
%c{#b80}
Requesting rescue...
---
%c{#b80}
Who am I kidding. We won't survive until rescue arrives, even from the fastest ship.
---
%c{#b80}
Requesting recovery.
---
%c{#b80}
Jessup out.
`.trim(), onDiscover: (entity: Entity) => null
}
