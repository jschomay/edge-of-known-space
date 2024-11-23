import Entity from "./entity";
import XY from "./xy";
import Game from "./game";
import Player from "./entities/player";
import pubsub from "./pubsub";
import TextBuffer from "./textbuffer"
import { entityFromCh } from "./entities";
import Item from "./items";
import TerminalItem from "./items/terminal";
import { MapData } from "./level-data";
import * as mapData from "./level-data";

const DEBUG = 1
function debug(level: MainLevel) {
  [mapData.map1].forEach(level.expandMap.bind(level))
  level.addInventory(new TerminalItem(level))
}


export interface Level {
  onKeyDown(e: KeyboardEvent): void
  draw(xy: XY): void
  getSize(): XY
  getEntityAt(xy: XY): Entity | null
  setEntity(entity: Entity, xy: XY): void
}


export default class MainLevel {
  private _size: XY;
  private _specialEntities: Entity[];
  private _map: Record<string, Entity>;
  private _fovCells: XY[] = []
  textBuffer: TextBuffer;
  game: Game
  player: Player
  _inventory: Record<string, Item> = {}
  activeItem: string | null = null

  constructor(game: Game) {
    this.game = game;
    this._specialEntities = []
    this._map = {};
    this._size = new XY(110, 40);

    this.expandMap(mapData.map0);

    this.textBuffer = new TextBuffer(this.game);

    let size = this.getSize();
    let bufferSize = 3;
    this.textBuffer.configure({
      position: new XY(0, 0),
      size: new XY(size.x, bufferSize)
    });
    this.textBuffer.clear();

    this.player = new Player(game);
    let playerStart = new XY(37, 17);
    this.setSpecialEntity(this.player, playerStart)

    game.scheduler.clear();
    game.scheduler.add(this.player, true);



    this.textBuffer.write("Where did everyone go?\n\nUse the arrow keys or WASD to move.")

    if (DEBUG) {
      debug(this)
    }
  }

  onKeyDown(e: KeyboardEvent) {
    this.textBuffer.clear();

    if (this.textBuffer.showing) {
      if (e.key === "Enter") {
        this.textBuffer.clearDisplayBox()
        this.updateFOV()
      }

    } else if (e.key === this.activeItem) {
      // deactivate item
      this._inventory[this.activeItem].onDeactivate()
      this.activeItem = null
      this._drawInventory()
      this.updateFOV()

    } else if (e.key in this._inventory) {
      // active item
      let item = this._inventory[e.key]
      this.activeItem = item.key
      this._drawInventory()
      item.onActivate()
      this.updateFOV()

    } else {
      this.player.onKeyDown(e)
    }
  }


  draw(xy: XY): void {
    let entity = this.getEntityAt(xy);
    if (!entity) { return; }
    let visual = entity.getVisual();
    this.game.display.draw(xy.x, xy.y, visual.ch, visual.fg);
  }

  expandMap(map: MapData) {
    let { mapData, specialEntities } = map(this.game)
    this._generateMap(mapData);
    specialEntities?.forEach(({ entity, xy }) => this.setSpecialEntity(entity, xy))
  }

  addInventory(item: Item) {
    this._inventory[item.key] = item
    this._drawInventory()
  }

  getSize() { return this._size; }

  setEntity(entity: Entity, xy: XY) {
    entity.setPosition(xy, this); // propagate position data to the entity itself
    this._map[xy.toString()] = entity;
    this.draw(xy);
  }

  getEntityAt(xy: XY, includeHidden: boolean = false): Entity | null {
    return this._specialEntities.find(
      e => ((e.visible || includeHidden) && e.getXY()?.toString() == xy?.toString()))
      || this._map[xy.toString()]
  }

  setSpecialEntity(entity: Entity, xy: XY) {
    this._specialEntities.push(entity)
    entity.setPosition(xy, this);
    this.draw(xy);
  }

  removeSpecialEntity(entity: Entity) {
    this._specialEntities = this._specialEntities.filter(e => e != entity)
    this.draw(entity.getXY()!);
  }

  updateFOV() {
    // clear old FOV
    while (this._fovCells.length) {
      this.draw(this._fovCells.pop()!);
    }

    let item_fov = this.activeItem && this._inventory[this.activeItem].getFOV()
    if (!item_fov) { return; }

    let { x: player_x, y: player_y } = this.player.getXY()!
    let { r: fov_r, fov, cb } = item_fov

    // draw new FOV
    fov.compute(player_x, player_y, fov_r, (x, y, r, visibility) => {
      let xy = new XY(x, y)
      let e = this.getEntityAt(xy)
      if (!e) { return; }

      this._fovCells.push(xy);
      // let multplier = Math.round(255 * Math.pow((fov_r / r), 3) / fov_r)
      // let fgBrighter = Color.add(Color.fromString(fg), [multplier, multplier, multplier]);
      cb(x, y, r, visibility)
    });
  }

  _drawInventory() {
    let { x, y } = this.getSize()
    for (let key in this._inventory) {
      let index = parseInt(key) + 3
      let activeIndicator = this.activeItem === key ? "* " : "  "
      this.game.display.drawText(index, y - 1, `%c{${this._inventory[key].color}}[${key}]%c{} ` + activeIndicator + this._inventory[key].name)
    }
  }


  _generateMap(data: string) {
    // Uncomment to debug full level size
    // for (let i = 0; i < this._size.x; i++) {
    //   for (let j = 0; j < this._size.y; j++) {
    //     this.game.display.draw(i, j, "1", "#222");
    //   }
    // }
    // TODO change to json structure instead of text
    let map = data.split("\n")
    for (let row = 0; row < this._size.y; row++) {
      for (let col = 0; col < this._size.x; col++) {
        // ignore map areas already drawn
        if (this._map[col + "," + row]) { continue; }

        // skip empty
        let mapCh = map[row][col]
        if (mapCh === " ") { continue; }

        let xy = new XY(col, row);
        let entity = entityFromCh(mapCh, this.game)
        this.setEntity(entity, xy)
        this.draw(xy);
      }
    }
  }
}
