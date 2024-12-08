import map0Data from "./main-level-0.txt?raw"
import map1Data from "./main-level-1.txt?raw"
import map2Data from "./main-level-2.txt?raw"
import Game from "../game"
import Entity from "../entity"
import XY from "../xy"
import Terminal from "../entities/terminal"
import Log, * as logs from "../entities/log"
import Torch from "../entities/torch"
import Officer, * as messages from "../entities/officer";

// TODO change maps to json level to obscure

export type MapData = (game: Game) => {
  mapData: string
  specialEntities?: { xy: XY, entity: Entity }[]
}

export const map0: MapData = (game: Game) => ({
  mapData: map0Data,
})


export const map1: MapData = (game: Game) => ({
  mapData: map1Data,
  specialEntities: [
    { xy: new XY(41, 15), entity: new Terminal(game) },
    { xy: new XY(37, 17), entity: new Log(game, logs.EMPTY_SHIP) },
    { xy: new XY(24, 19), entity: new Log(game, logs.SCIENCE_OFFICER_FIRST) },
  ]
})

export const map2: MapData = (game: Game) => ({
  mapData: map2Data,
  specialEntities: [
    { xy: new XY(66, 10), entity: new Torch(game) },
    { xy: new XY(64, 17), entity: new Log(game, logs.LO_BRIDGE) },
    { xy: new XY(7, 6), entity: new Officer(game, messages.BALTHAR) },
  ]
})
