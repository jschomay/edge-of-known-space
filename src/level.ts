import RecursiveShadowcasting from "../lib/rotjs/fov/recursive-shadowcasting";
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
import BridgeItem, { KEY as BRIDGE_KEY } from "./items/bridge";
import EVItem, { KEY as EV_KEY } from "./items/ev";
import EV from "./entities/ev";
import CrystalShard from "./entities/crystal-shard";

const DEBUG = 0
function debug(level: MainLevel) {
  const showFullMap = () => {
    Object.values(level._map).forEach(e => e.visible = true);
    level._specialEntities.forEach(e => e.visible = true)
    for (let x = 0; x < level._size.x; x++) {
      for (let y = 0; y < level._size.y - 1; y++) {
        const xy = new XY(x, y)
        level.draw(xy)
      }
    }
  }
  // showFullMap()

  level.battery = 1
  level.addInventory(new TerminalItem(level))
  level.addInventory(new TorchItem(level))
  level.addInventory(new ScannerItem(level))
  level.addInventory(new BridgeItem(level))
  level.addInventory(new EVItem(level))

  level.removeSpecialEntity(level.ev)
  level.setSpecialEntity(level.ev, new XY(99, 31))

  level.player.setPosition(new XY(99, 30))


  // inspect helpers
  window._at = (x, y, ...rest) => level.getEntityAt(new XY(x, y), ...rest)
  level.game._container.addEventListener("click", e => console.log(level.getEntityAt(new XY(...level.game.display.eventToPosition(e)), true)))
  level.game._container.addEventListener("click", e => {
    let xy = new XY(...level.game.display.eventToPosition(e))
    let oldXy = level.player.getXY()
    level.player.setPosition(xy)
    level.draw(oldXy)
    level.draw(xy)
    level.updateFOV()
  }
  )

  window.addEventListener("keyup", (e) => {
    if (e.key === "8") {
      level.powerLevel = (level.powerLevel + 1)
      if (level.powerLevel > 4) level.powerLevel = 1
      level.activeItem && level._inventory[level.activeItem].setPower()
      level.drawNewShard()
      level.drawPower()
      level.updateFOV()
      return
    }
  })
}


export default class MainLevel {
  private _size: XY;
  private _specialEntities: Entity[];
  private _map: Record<string, Entity>;
  private _fovCells: XY[] = []
  textBuffer: TextBuffer;
  game: Game
  player: Player
  ev!: EV
  _inventory: Record<string, Item> = {}
  activeItem: string | null = null
  powerLevel = 1
  battery = 0
  loDiscovered = false
  loOnShip = false

  constructor(game: Game) {
    this.game = game;
    this._specialEntities = []
    this._map = {};
    this._size = new XY(110, 41);

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
    this.textBuffer.clear()

    if (this.textBuffer.showing) {
      if (e.key === "Enter") {
        this.textBuffer.clearDisplayBox()
      }

    } else if (e.key === this.activeItem) {
      this.deactivateItem(e.key)

    } else if (e.key in this._inventory) {
      this.activateItem(e.key)

    } else {
      this.player.onKeyDown(e)
    }

    // debug active item and ev state
    // this.textBuffer.write(`EV: ${this.ev.playerIsRiding() ? "riding" : "not riding"}, EV loaded: ${!!this.ev._loaded}, EV in range: ${this.ev.inRange()}, active item: ${this.activeItem}`)
  }

  activateItem(key: string) {
    if (this.battery === 0) {
      this.textBuffer.write("The power cell is dead.")
      return
    }
    let item = this._inventory[key]
    item.setPower()
    if (!item.onActivate()) return

    if (this.activeItem) {
      this.deactivateItem(this.activeItem)
    }
    this.activeItem = item.key
    this._drawInventory()
    this.updateFOV()
  }

  deactivateItem(key: string) {
    let item = this._inventory[key]
    if (!item.onDeactivate()) return

    this.activeItem = null
    this._drawInventory()
    this.updateFOV()
  }


  draw(xy: XY): void {
    // player isn't tracked via getEntityAt
    if (this.player.visible && this.player.getXY()?.toString() === xy.toString()) {
      let { ch, fg } = this.player.getVisual()
      this.game.display.draw(xy.x, xy.y, ch, fg);
      return
    }

    let terrainEntity = this.getEntityAt(xy, false, true);
    let specialEntity = this.getEntityAt(xy, true, false);
    if (!terrainEntity && !specialEntity) { return; }

    let atLeastOneExistsAndIsVisible = (terrainEntity?.visible || specialEntity?.visible)

    if (!atLeastOneExistsAndIsVisible) {
      // completely undiscovered
      this.game.display.draw(xy.x, xy.y, " ", "white");
      return
    }

    let entity = this.getEntityAt(xy);
    let visual = entity!.getVisual();
    this.game.display.draw(xy.x, xy.y, visual.ch, visual.fg);
  }

  addInventory(item: Item) {
    this._inventory[item.key] = item
    if (item instanceof EVItem) {
      this.ev.remote = item
    }
    this.drawPower()
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
    // this is probably only an issue for the player, so it ignores the player entity if requested
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

    let item = this.activeItem && this._inventory[this.activeItem]
    if (!item) { return; }
    item.setPower()

    let item_fov = item && item.getFOV()
    if (!item_fov) { return; }


    let { x: player_x, y: player_y } = this.player.getXY()!
    let { r: fov_r, fov, cb } = item_fov

    let wrappedCb = (x, y, r, visibility) => {
      // don't include player
      if (r === 0) return;
      // don't render over top and bottom display
      if (y < 3 || y > this._size.y - 2) return;

      let xy = new XY(x, y)
      this._fovCells.push(xy);

      cb(x, y, r, visibility)
    }

    // draw new FOV
    if (fov instanceof RecursiveShadowcasting && this.ev.playerIsRiding()) {
      fov.compute90(player_x, player_y, fov_r, this.ev.direction, wrappedCb);
    } else {

      fov.compute(player_x, player_y, fov_r, wrappedCb);
    }
  }

  _drawInventory() {
    let { x, y } = this.getSize()
    let offset = 20
    for (let i = offset; i < x - 1; i++) {
      this.game.display.draw(i, y - 1, " ", null, null);
    }

    for (let key of Object.keys(this._inventory).sort()) {
      let activeIndicator = this.activeItem === key ? "*" : " "
      let keyInfo = `%c{${this._inventory[key].color}}[${key}]%c{}`
      let keyName = this._inventory[key].name
      let text = keyInfo + activeIndicator + keyName
      this.game.display.drawText(offset, y - 1, text, x)
      offset += keyName.length + 10
    }
  }

  drawNewShard() {
    let offset = 2 + this.powerLevel
    let { x, y } = this.getSize()
    let row = y - 1
    let xy = new XY(offset, row)
    let shard = new CrystalShard(this.game)
    shard.visible = true
    this.setSpecialEntity(shard, xy)
    this.draw(xy)
  }

  drawPower() {
    let { x, y } = this.getSize()
    let row = y - 1
    let powerBarOffset = 9
    let powerBarRange = 5

    let dot = (i) => {
      let color = "#0f0"
      if (this.battery < 4) color = "#fa0"
      if (this.battery < 3) color = "#f00"
      let ch = i < this.battery ? "." : " "
      this.game.display.draw(powerBarOffset + i, row, ch, color)
    }

    this.game.display.draw(powerBarOffset - 1, row, "[")
    this.game.display.draw(powerBarOffset + powerBarRange, row, "]")
    for (let i = 0; i < powerBarRange; i++) {
      dot(i)
    }
  }


  _generateMap(data: string) {
    let fullMap = mapData.fullMap.split("\n")
    let map = data.split("\n")
    for (let row = 0; row < this._size.y; row++) {
      for (let col = 0; col < this._size.x; col++) {

        // empty spots are unknown but explorable
        let isUnknown = map[row][col] == " "
        let ch = fullMap[row][col]

        let xy = new XY(col, row);
        let existingEntity = this.getEntityAt(xy)

        // don't put the player in specialEntity (to avoid overlapping special entities)
        if (ch === "@") {
          this.player.setPosition(xy, this)
          // draw ground underneath
          ch = "."
        }
        let { terrain: t, special: s } = entityFromCh(ch, this.game)

        if (s instanceof EV) { this.ev = s }

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
