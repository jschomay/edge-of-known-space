import Game from "../game";
import Entity from "../entity";
import Ship from "./ship";
import Intrepid from "./intrepid";
import PowerCore from "./power-core";
import Cliff from "./cliff";
import Crystal from "./crystal";
import Bridge from "./bridge";
import Chasm from "./chasm";
import Terminal from "./terminal";
import Rubble from "./rubble";
import Rocky from "./rocky";
import Log from "./log";
import Torch from "./torch";
import Scanner from "./scanner";
import Lo from "./lo";
import * as logs from "./log";
import Officer from "./officer";
import * as officer_logs from "./officer";
import Boulder from "./boulder";
import EVRemote from "./ev-remote";
import EV from "./ev";
import CrystalShard from "./crystal-shard";
import Passage from "./passage";
import PowerDrain from "./power-drain";

const groundColor = "#430"

const specialEntitiesOnGroundTerrain = new Map<string, (game: Game) => Entity>();
// items
specialEntitiesOnGroundTerrain.set("p", (game) => new PowerCore(game));
specialEntitiesOnGroundTerrain.set("t", (game) => new Terminal(game));
specialEntitiesOnGroundTerrain.set("f", (game) => new Torch(game));
specialEntitiesOnGroundTerrain.set("b", (game) => new Bridge(game, { asItem: true }));
// officers
specialEntitiesOnGroundTerrain.set("X", (game) => new Officer(game, officer_logs.INTREPID1));
specialEntitiesOnGroundTerrain.set("Y", (game) => new Officer(game, officer_logs.INTREPID2));
specialEntitiesOnGroundTerrain.set("L", (game) => new Lo(game));
specialEntitiesOnGroundTerrain.set("r", (game) => new EVRemote(game));
// logs
specialEntitiesOnGroundTerrain.set("1", (game) => new Log(game, logs.EMPTY_SHIP));
specialEntitiesOnGroundTerrain.set("2", (game) => new Log(game, logs.SCIENCE_OFFICER_FIRST));
specialEntitiesOnGroundTerrain.set("3", (game) => new Log(game, logs.LO_BRIDGE));
specialEntitiesOnGroundTerrain.set("4", (game) => new Log(game, logs.LO_EXPLORE));
// features
specialEntitiesOnGroundTerrain.set("%", (game) => new Rubble(game));
specialEntitiesOnGroundTerrain.set("$", (game) => new Passage(game));
specialEntitiesOnGroundTerrain.set("*", (game) => new CrystalShard(game));


const specialEntitiesOnCrystalTerrain = new Map<string, (game: Game) => Entity>();
specialEntitiesOnCrystalTerrain.set("D", (game) => new Officer(game, officer_logs.BALTHAR));
specialEntitiesOnCrystalTerrain.set("s", (game) => new Scanner(game));

const specialEntitiesOnRockyTerraine = new Map<string, (game: Game) => Entity>();
specialEntitiesOnRockyTerraine.set("#", (game) => new Boulder(game));
specialEntitiesOnRockyTerraine.set("A", (game) => new Officer(game, officer_logs.ARGOS));
specialEntitiesOnRockyTerraine.set("E", (game) => new EV(game));
// Logs
specialEntitiesOnRockyTerraine.set("5", (game) => new Log(game, logs.LO_REPORT));
specialEntitiesOnRockyTerraine.set("6", (game) => new Log(game, logs.ARGOS_UNSTABLE));


const terrain = new Map<string, (game: Game) => Entity>();
terrain.set(".", (game) => new Entity(game, { ch: ".", fg: groundColor }));
terrain.set("`", (game) => new Rocky(game));
terrain.set("O", (game) => new Ship(game));
terrain.set("o", (game) => new Intrepid(game));
terrain.set("=", (game) => new Cliff(game));
terrain.set("/", (game) => new Crystal(game));
terrain.set(",", (game) => new Crystal(game, true));
terrain.set("]", (game) => new Crystal(game, false, true));
terrain.set("|", (game) => new Crystal(game, true, true));
terrain.set("~", (game) => new Chasm(game, true));
terrain.set(" ", (game) => new Chasm(game));
terrain.set("I", (game) => new Bridge(game, { broken: true }));
terrain.set("z", (game) => new PowerDrain(game, "z"));
terrain.set("x", (game) => new PowerDrain(game, "x"));
terrain.set("c", (game) => new PowerDrain(game, "c"));
terrain.set("v", (game) => new PowerDrain(game, "v"));


// returns terrain and possible special entity
export function entityFromCh(ch: string, game: Game): { terrain: Entity, special: Entity | null } {
  if (ch === "@") {
    // player gets set specially in level
    return { terrain: new Entity(game, { ch: ".", fg: groundColor }), special: null }
  }

  if (specialEntitiesOnGroundTerrain.has(ch)) {
    let s = specialEntitiesOnGroundTerrain.get(ch)!
    return { terrain: new Entity(game, { ch: ".", fg: groundColor }), special: s(game) }

  } else if (specialEntitiesOnCrystalTerrain.has(ch)) {
    let s = specialEntitiesOnCrystalTerrain.get(ch)!
    return { terrain: new Crystal(game, true), special: s(game) }
  }

  else if (specialEntitiesOnRockyTerraine.has(ch)) {
    let s = specialEntitiesOnRockyTerraine.get(ch)!
    return { terrain: new Rocky(game), special: s(game) }
  }

  else if (terrain.has(ch)) {
    let t = terrain.get(ch)!
    return { terrain: t(game), special: null }
  }

  else {
    return { terrain: new Entity(game, { ch: ch, fg: "red" }), special: null }
  }

}
