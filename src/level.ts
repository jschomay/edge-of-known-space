import Entity from "./entity";
import XY from "./xy";
import Game from "./game";
import { Color } from "../lib/rotjs";
import Player from "./entities/player";
import pubsub from "./pubsub";
import TextBuffer from "./textbuffer"
// TODO change to json level
import MAP from "../public/main-level.txt?raw"
import { entityFromCh } from "./entities";


export interface Level {
  onKeyDown(e: KeyboardEvent): void
  handleMessage(msg: string, publisher: any, data: any): void
  draw(xy: XY): void
  getSize(): XY
  getEntityAt(xy: XY): Entity | null
  setEntity(entity: Entity, xy: XY): void
}


export default class MainLevel {
  private _size: XY;
  private _movable_entities: Entity[];
  private _map: Record<string, Entity>;
  private _fovCells: XY[] = []
  textBuffer: TextBuffer;
  game: Game
  player: Player
  _ananas!: string

  constructor(game: Game) {
    this.game = game;
    this._movable_entities = []
    this._map = {};
    this._size = new XY(110, 40);

    this.player = new Player(game);
    game.scheduler.clear();
    game.scheduler.add(this.player, true);

    this._generateMap()


    this.textBuffer = new TextBuffer(this.game.display);

    let size = this.getSize();
    let bufferSize = 3;
    this.textBuffer.configure({
      position: new XY(0, 0),
      size: new XY(size.x, bufferSize)
    });
    this.textBuffer.clear();

    this.textBuffer.write("Use the arrow keys or WASD to move.")

    pubsub.subscribe("player-act-complete", this);
  }

  onKeyDown(e: KeyboardEvent) {
    if (this.textBuffer.showing) {
      e.key === "Enter" && this.textBuffer.clearDisplayBox(this.draw.bind(this))
    } else {
      this.textBuffer.clear();
      this.player.onKeyDown(e)
    }
  }


  draw(xy: XY): void {
    let entity = this.getEntityAt(xy);
    if (!entity) { return; }
    let visual = entity.getVisual();
    this.game.display.draw(xy.x, xy.y, visual.ch, visual.fg);
  }

  handleMessage(msg: string, publisher: any, data: any) {
    if (msg === "player-act-complete") {
      this._updateFOV();
    }
  }

  getSize() { return this._size; }

  setEntity(entity: Entity, xy: XY) {
    entity.setPosition(xy, this); // propagate position data to the entity itself
    this._map[xy.toString()] = entity;
    this.draw(xy);
  }

  getEntityAt(xy: XY): Entity | null {
    return this._movable_entities.find(e => e.getXY() == xy) || this._map[xy.toString()]
  }

  _updateFOV() {
    // TODO
    return;
    // clear old FOV
    while (this._fovCells.length) {
      this.draw(this._fovCells.pop()!);
    }

    let { x: player_x, y: player_y } = this.player.getXY()!
    let { r: player_r, fov } = this.player.getFOV()

    // draw new FOV
    fov.compute(player_x, player_y, player_r, (x, y, r, visibility) => {
      let e = this.getEntityAt(new XY(x, y))
      if (!e) { return; }

      this._fovCells.push(new XY(x, y));
      let { ch, fg } = e.getVisual()
      let multplier = Math.round(255 * Math.pow((player_r / r), 3) / player_r)
      let fgBrighter = Color.add(Color.fromString(fg), [multplier, multplier, multplier]);
      this.game.display.draw(x, y, ch, Color.toHex(fgBrighter));
    });
  }


  _generateMap() {
    // Uncomment to debug full level size
    // for (let i = 0; i < this._size.x; i++) {
    //   for (let j = 0; j < this._size.y; j++) {
    //     this.game.display.draw(i, j, "1", "#222");
    //   }
    // }
    // TODO change to json structure instead of text
    let map = MAP.split("\n")
    for (let row = 0; row < this._size.y; row++) {
      for (let col = 0; col < this._size.x; col++) {
        let mapCh = map[row][col]

        if (mapCh === " ") { continue; }
        let xy = new XY(col, row);
        if (mapCh === "@") {
          // treat as "spawn point"
          this._movable_entities.push(this.player)
          this.player.setPosition(xy, this);
          // still add "ground" under spawn point
          mapCh = "."
        }
        let entity = entityFromCh(mapCh, this.game)
        this.setEntity(entity, xy)
        this.draw(xy);
      }
    }
  }
}
