import Game from "./game";
import XY from "./xy";
import level1Data from "./level-data/end-screen.txt?raw";
import { RNG } from "../lib/rotjs";


export default class EndScreen {

  size = new XY(110, 40);
  game: Game
  _levelData = level1Data
  _state = 1
  _interval

  constructor(game: Game) {
    this.game = game
    this._generateMap()
    this._state++
  }

  draw(xy: XY): void {
    this._generateMap()
  }


  updateFOV() {
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.key !== "Enter") { return }
    if (this._state < 7) {
      clearInterval(this._interval)
      this._generateMap()
    }
    this._state++
  }

  getSize() { return this.size }

  _clear() {
    for (let i = 0; i < this.size.y; i++) {
      for (let j = 0; j < this.size.x; j++) {
        this.game.display.draw(j, i, " ", null, null);
      }
    }
  }

  _generateMap() {
    for (let row = 0; row < this.size.y; row++) {
      for (let col = 0; col < this.size.x; col++) {
        let map = this._levelData.split("\n")
        let ch = map[row][col]

        if (this._state === 1) {
          this.game.display.drawText(32, 38, "%c{#ff0}Press [Enter] to wake up from cryosleep...")
        }


        if (this._state === 2) {
          this.game.display.drawText(32, 38, "%c{#ff0}Press [Enter] to continue...")
        }


        let color = ch === "#" ? "#950" : "white"
        if (ch === "/") {
          ch = RNG.getUniform() > 0.5 ? "/" : "\\"
          color = RNG.getUniform() > 0.5 ? "#a0e" : "#0ae"
        }

        this.game.display.draw(col, row, ch, color);
      }
    }
  }

}
