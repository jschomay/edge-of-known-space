import Game from "../game";
import Entity from "../entity";
import Ship from "./ship";
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
import * as logs from "./log";
import Officer from "./officer";
import * as officer_logs from "./officer";
import Boulder from "./boulder";

const groundColor = "#430"

const specialEntitiesOnGroundTerrain = new Map<string, (game: Game) => Entity>();
// items
specialEntitiesOnGroundTerrain.set("t", (game) => new Terminal(game));
specialEntitiesOnGroundTerrain.set("f", (game) => new Torch(game));
specialEntitiesOnGroundTerrain.set("b", (game) => new Bridge(game));
specialEntitiesOnGroundTerrain.set("c", (game) => new Torch(game)); // TODO maybe this becomes a compass/tracker?
// officers
specialEntitiesOnGroundTerrain.set("S", (game) => new Officer(game, officer_logs.TODO));
specialEntitiesOnGroundTerrain.set("H", (game) => new Officer(game, officer_logs.TODO));
// logs
specialEntitiesOnGroundTerrain.set("1", (game) => new Log(game, logs.EMPTY_SHIP));
specialEntitiesOnGroundTerrain.set("2", (game) => new Log(game, logs.SCIENCE_OFFICER_FIRST));
specialEntitiesOnGroundTerrain.set("3", (game) => new Log(game, logs.LO_BRIDGE));
specialEntitiesOnGroundTerrain.set("4", (game) => new Log(game, logs.TODO));
specialEntitiesOnGroundTerrain.set("5", (game) => new Log(game, logs.TODO));
specialEntitiesOnGroundTerrain.set("6", (game) => new Log(game, logs.TODO));
specialEntitiesOnGroundTerrain.set("7", (game) => new Log(game, logs.TODO));
// features
specialEntitiesOnGroundTerrain.set("%", (game) => new Rubble(game));
specialEntitiesOnGroundTerrain.set("$", (game) => new Rubble(game)); // TODO level 2 rubble


const specialEntitiesOnCrystalTerrain = new Map<string, (game: Game) => Entity>();
specialEntitiesOnCrystalTerrain.set("D", (game) => new Officer(game, officer_logs.BALTHAR));
specialEntitiesOnCrystalTerrain.set("s", (game) => new Scanner(game));
specialEntitiesOnCrystalTerrain.set("*", (game) => new Rubble(game)); // TODO crystal shard

const specialEntitiesOnRockyTerraine = new Map<string, (game: Game) => Entity>();
specialEntitiesOnRockyTerraine.set("#", (game) => new Boulder(game));
specialEntitiesOnRockyTerraine.set("B", (game) => new Officer(game, officer_logs.TODO));
specialEntitiesOnRockyTerraine.set("r", (game) => new Torch(game)); // TODO EV remote
specialEntitiesOnRockyTerraine.set("E", (game) => new Boulder(game)); // TODO EV


const terrain = new Map<string, (game: Game) => Entity>();
terrain.set(".", (game) => new Entity(game, { ch: ".", fg: groundColor }));
terrain.set("`", (game) => new Rocky(game));
terrain.set("o", (game) => new Ship(game));
terrain.set("i", (game) => new Ship(game)); // TODO intrepid ship
terrain.set("^", (game) => new Ship(game)); // TODO reactor
terrain.set("=", (game) => new Cliff(game));
terrain.set("/", (game) => new Crystal(game));
terrain.set("\\", (game) => new Crystal(game, false, true)); // visible edge of crystal zone
terrain.set(",", (game) => new Crystal(game, true));
terrain.set("~", (game) => new Chasm(game));
terrain.set("I", (game) => new Bridge(game, true, true));


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
