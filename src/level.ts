import Entity from "./entity";
import XY from "./xy";
import Game from "./game";
import Player from "./entities/player";
import TextBuffer from "./textbuffer"
import { entityFromCh } from "./entities";
import Item from "./items";
import TerminalItem from "./items/terminal";
import { MapData } from "./level-data";
import * as mapData from "./level-data";
import TorchItem from "./items/torch";

const DEBUG = 1
function debug(level: MainLevel) {
  [mapData.map1, mapData.map2].forEach(level.expandMap.bind(level))
  level.addInventory(new TerminalItem(level))
  level.addInventory(new TorchItem(level))
  level.activateItem("1")
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
      this.deactivateItem(e.key)

    } else if (e.key in this._inventory) {
      this.activateItem(e.key)

    } else {
      this.player.onKeyDown(e)
    }
  }

  activateItem(key: string) {
    let item = this._inventory[key]
    this.activeItem = item.key
    this._drawInventory()
    item.onActivate()
    this.updateFOV()
  }

  deactivateItem(key: string) {
    let item = this._inventory[key]
    item.onDeactivate()
    this.activeItem = null
    this._drawInventory()
    this.updateFOV()
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
    const special = this._specialEntities.find(e => e.getXY()?.toString() == xy.toString())
    if (special && (special.visible || includeHidden)) return special

    const map = this._map[xy.toString()]
    if (map && (map.visible || includeHidden)) return map

    return null
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
      if (r === 0) return;
      let xy = new XY(x, y)
      let e = this.getEntityAt(xy)
      if (!e) { return; }

      this._fovCells.push(xy);
      cb(x, y, r, visibility)
    });
  }

  _drawInventory() {
    let { x, y } = this.getSize()
    for (let key in this._inventory) {
      let index = parseInt(key) * Math.floor(x / 6) + 3
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

        // skip empty
        let mapCh = map[row][col]
        if (mapCh === " ") { continue; }

        let xy = new XY(col, row);
        let existingEntity = this.getEntityAt(xy)

        let newEntity = entityFromCh(mapCh, this.game)
        this.setEntity(newEntity, xy)

        // useful for example when swapping out crystal with clearing
        if (existingEntity) { newEntity.visible = existingEntity.visible; }

        this.draw(xy);
      }
    }
  }
}
