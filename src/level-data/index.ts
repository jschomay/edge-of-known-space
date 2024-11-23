import map0Data from "./main-level-0.txt?raw"
import map1Data from "./main-level-1.txt?raw"
import Terminal from "../entities/terminal"
import Log, * as logs from "../entities/log"
import Game from "../game"
import Entity from "../entity"
import XY from "../xy"

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
    { xy: new XY(24, 17), entity: new Log(game, logs.SCIENCE_OFFICER_FIRST) },
  ]
})
