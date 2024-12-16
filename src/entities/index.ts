import Game from "../game";
import Entity from "../entity";
import Ship from "./ship";
import Cliff from "./cliff";
import Crystal from "./crystal";
import Bridge from "./bridge";
import Chasm from "./chasm";
import Terminal from "./terminal";
import Rubble from "./rubble";
import Log from "./log";
import Torch from "./torch";
import Scanner from "./scanner";
import * as logs from "./log";
import Officer from "./officer";
import * as officer_logs from "./officer";

const groundColor = "#430"

const groundSpecial = new Map<string, (game: Game) => Entity>();
groundSpecial.set("#", (game) => new Terminal(game));
groundSpecial.set("v", (game) => new Torch(game));
groundSpecial.set("1", (game) => new Log(game, logs.EMPTY_SHIP));
groundSpecial.set("2", (game) => new Log(game, logs.SCIENCE_OFFICER_FIRST));
groundSpecial.set("3", (game) => new Log(game, logs.LO_BRIDGE));
groundSpecial.set("%", (game) => new Rubble(game));


const crystalSpecial = new Map<string, (game: Game) => Entity>();
crystalSpecial.set("B", (game) => new Officer(game, officer_logs.BALTHAR));
crystalSpecial.set("Y", (game) => new Scanner(game));


const terrain = new Map<string, (game: Game) => Entity>();
terrain.set(".", (game) => new Entity(game, { ch: ".", fg: groundColor }));
terrain.set("o", (game) => new Ship(game));
terrain.set("=", (game) => new Cliff(game));
terrain.set("/", (game) => new Crystal(game));
terrain.set("\\", (game) => new Crystal(game, false, true)); // visible edge of crystal zone
terrain.set(",", (game) => new Crystal(game, true));
terrain.set("I", (game) => new Bridge(game, true));
terrain.set("~", (game) => new Chasm(game));


// returns terrain and possible special entity
export function entityFromCh(ch: string, game: Game): { terrain: Entity, special: Entity | null } {
  if (ch === "@") {
    // player gets set specially in level
    return { terrain: new Entity(game, { ch: ".", fg: "#444" }), special: null }
  }

  if (groundSpecial.has(ch)) {
    let s = groundSpecial.get(ch)!
    return { terrain: new Entity(game, { ch: ".", fg: "#444" }), special: s(game) }

  } else if (crystalSpecial.has(ch)) {
    let s = crystalSpecial.get(ch)!
    return { terrain: new Crystal(game, true), special: s(game) }
  }

  else if (terrain.has(ch)) {
    let t = terrain.get(ch)!
    return { terrain: t(game), special: null }
  }

  else {
    return { terrain: new Entity(game, { ch: ch, fg: "red" }), special: null }
  }

}
