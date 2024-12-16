import Entity from "./entity";
import XY from "./xy";
import Game from "./game";
import Player from "./entities/player";
import TextBuffer from "./textbuffer"
import { entityFromCh } from "./entities";
import Item from "./items";
import TerminalItem from "./items/terminal";
import * as mapData from "./level-data";
import TorchItem from "./items/torch";
import ScannerItem from "./items/scanner";

const DEBUG = 0
function debug(level: MainLevel) {
  // this._generateMap(mapData.fullMap)
  // level.addInventory(new TerminalItem(level))
  level.addInventory(new TorchItem(level))
  level.addInventory(new ScannerItem(level))
  // level.activateItem("2")

  // inspect helpers
  window._at = (x, y, ...rest) => level.getEntityAt(new XY(x, y), ...rest)
  level.game._container.addEventListener("click", e => console.log(level.getEntityAt(new XY(...level.game.display.eventToPosition(e)), true)))
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

    this.player = new Player(game);
    // get's positioneed according to map in generateMap
    this.player.setPosition(new XY(0, 0), this);

    this._generateMap(mapData.map0);

    this.textBuffer = new TextBuffer(this.game);

    let size = this.getSize();
    let bufferSize = 3;
    this.textBuffer.configure({
      position: new XY(0, 0),
      size: new XY(size.x, bufferSize)
    });
    this.textBuffer.clear();

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

  getEntityAt(xy: XY, includeHiddenSpecial: boolean = false, includeHiddenTerrain: boolean = false): Entity | null {
    // NOTE special entities can share the same spot which might create bugs
    // this find the first one (following visibility request)
    const special = this._specialEntities.find(e => (e.visible || includeHiddenSpecial) && e.getXY()?.toString() == xy.toString())
    if (special) return special

    const map = this._map[xy.toString()]
    if (map && (map.visible || includeHiddenTerrain)) return map

    return null
  }

  setSpecialEntity(entity: Entity, xy: XY) {
    this._specialEntities.push(entity)
    entity.setPosition(xy, this);
    this.draw(xy);
  }

  removeSpecialEntity(entity: Entity) {
    this._specialEntities = this._specialEntities.filter(e => e != entity)
    let terrainUnderEntity = this.getEntityAt(entity.getXY()!, false, true)
    if (terrainUnderEntity) { terrainUnderEntity.visible = true; }
    this.draw(entity.getXY()!);
  }

  isSpecial(entity: Entity) {
    return this._specialEntities.includes(entity)
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
      // don't include player
      if (r === 0) return;

      let xy = new XY(x, y)
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
    // TODO change to json structure instead of text
    let fullMap = mapData.fullMap.split("\n")
    let map = data.split("\n")
    for (let row = 0; row < this._size.y; row++) {
      for (let col = 0; col < this._size.x; col++) {

        // empty spots are unknown but explorable
        let isUnknown = map[row][col] == " "
        let ch = fullMap[row][col]

        let xy = new XY(col, row);
        let existingEntity = this.getEntityAt(xy)

        let { terrain: t, special: s } = entityFromCh(ch, this.game)
        if (ch === "@") s = this.player

        if (isUnknown) { t.visible = false; }
        this.setEntity(t, xy)
        if (s) this.setSpecialEntity(s, xy)

        // useful for example when swapping out crystal with clearing
        if (existingEntity) { t.visible = existingEntity.visible; }

        this.draw(xy);
      }
    }
  }
}
