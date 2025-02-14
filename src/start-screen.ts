import Game from "./game";
import XY from "./xy";
import level1Data from "./level-data/start-screen.txt?raw";
import MainLevel from "./level";


export default class StartScreen {

  size = new XY(110, 40);
  game: Game
  _levelData = level1Data
  _state = 1
  _interval

  constructor(game: Game) {
    this.game = game
    this._generateMap()
    this._state++
    let flash = true
    this._interval = setInterval(() => {
      this.game.display.draw(33, 17, "+", flash ? "#0f0" : "#0a0")
      this.game.display.draw(35, 17, "+", flash ? "#0f0" : "#0a0")
      flash = !flash
    }, 1000)
  }

  draw(xy: XY): void {
    this._generateMap()
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.key !== "Enter") { return }
    if (this._state < 7) {
      clearInterval(this._interval)
      this._generateMap()
    } else {
      this._clear()
      this.game.switchLevel(new MainLevel(this.game))
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
    let map = this._levelData.split("\n")
    for (let row = 0; row < this.size.y; row++) {
      for (let col = 0; col < this.size.x; col++) {
        let ch = map[row][col]

        if (this._state === 1) {
          if ([11, 15, 19, 23, 27, 31].includes(row)) ch = " "
          this.game.display.drawText(32, 38, "%c{#ff0}Press [Enter] to wake up from cryosleep...")
        }

        if (this._state > 1) {
          // if ([15, 19, 23, 27, 31, 38].includes(row)) ch = " "
          // draw player pod
          if (row == 17 && [33, 35].includes(col)) ch = "x"
          if (row == 17 && col === 34) ch = " "
          if (row == 17 && col === 38) ch = "@"
        }

        if (this._state === 2) {
          if ([15, 19, 23, 27, 31, 38].includes(row)) ch = " "
          this.game.display.drawText(32, 38, "%c{#ff0}Press [Enter] to continue...")
        }

        if (this._state === 3) {
          if ([23, 27, 31, 38].includes(row)) ch = " "
          this.game.display.drawText(32, 38, "%c{#ff0}Press [Enter] to continue...")
        }
        if (this._state === 4) {
          if ([27, 31, 38].includes(row)) ch = " "
          this.game.display.drawText(32, 38, "%c{#ff0}Press [Enter] to continue....")
        }
        if (this._state === 5) {
          if ([31, 38].includes(row)) ch = " "
          this.game.display.drawText(32, 38, "%c{#ff0}Press [Enter] to continue.....")
        }

        let color = ch === "x" ? "#f00" : ch === "+" ? "#0f0" : ch === "@" ? "#ff0" : "-\\/".includes(ch) ? "#666" : "#ddd";
        if (row === 11) { color = "#f00" }
        if (row === 38) { color = "#ff0" }
        // colorize title
        if (row < 10) { color = "#f0f" }
        if (row < 6) { color = "#0af" }
        if (row < 4) { color = "#0ff" }

        this.game.display.draw(col, row, ch, color);
      }
    }
  }

}
