import Game from "./game";
import XY from "./xy";
import { Level } from "./level";

export default class StartScreen implements Level {

  static title = `
     8""""                                   8   8                                8""""8                       
    8     eeeee eeeee eeee    eeeee eeee    8   8  eeeee eeeee e   e  e eeeee    8      eeeee eeeee eeee eeee 
   8eeee 8   8 8   8 8       8  88 8       8eee8e 8   8 8  88 8   8  8 8   8    8eeeee 8   8 8   8 8  8 8    
  88    8e  8 8e    8eee    8   8 8eee    88   8 8e  8 8   8 8e  8  8 8e  8        88 8eee8 8eee8 8e   8eee 
 88    88  8 88 "8 88      8   8 88      88   8 88  8 8   8 88  8  8 88  8    e   88 88    88  8 88   88   
88eee 88ee8 88ee8 88ee    8eee8 88      88   8 88  8 8eee8 88ee8ee8 88  8    8eee88 88    88  8 88e8 88ee 
`.trim()

  size = new XY(110, 40);
  game: Game

  constructor(game: Game) {
    this.game = game
    this._generateMap()
  }

  draw(xy: XY): void {
    this._generateMap()
  }

  onKeyDown(e: KeyboardEvent): void {
    // this.game.level = this.game.mainLevel
  }

  getSize() { return this.size }

  _generateMap() {
    let titlePos = new XY(3, 3)
    this.game.display.drawText(titlePos.x, titlePos.y, StartScreen.title, this.size.x)
  }

}
