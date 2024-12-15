import map0Data from "./main-level-0.txt?raw"
import map2Data from "./main-level-2.txt?raw"
import Game from "../game"
import Entity from "../entity"
import XY from "../xy"
import Terminal from "../entities/terminal"
import Log, * as logs from "../entities/log"
import Officer, * as messages from "../entities/officer";
import Torch from "../entities/torch"

// TODO change maps to json level to obscure

export type MapData = (game: Game) => {
  mapData: string
  specialEntities?: { xy: XY, entity: Entity }[]
}

export const map0: MapData = (game: Game) => ({
  mapData: map0Data,
  specialEntities: [
    { xy: new XY(45, 15), entity: new Terminal(game) },
    { xy: new XY(66, 12), entity: new Torch(game) },
    { xy: new XY(7, 6), entity: new Officer(game, messages.BALTHAR) },
    { xy: new XY(64, 17), entity: new Log(game, logs.LO_BRIDGE) },
    { xy: new XY(37, 17), entity: new Log(game, logs.EMPTY_SHIP) },
    { xy: new XY(25, 19), entity: new Log(game, logs.SCIENCE_OFFICER_FIRST) },
  ]
})

export const fullMap: MapData = (game: Game) => ({
  mapData: map2Data,
  specialEntities: []
})
