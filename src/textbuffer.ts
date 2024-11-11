import XY from "./xy";
import { Display } from "../lib/rotjs";
import Game from "./game";

export default class TextBuffer {
  public showing: boolean;
  private _game: Game
  private _data: string[];
  private displayBoxPos: XY;
  private displayBoxSize: XY
  private _options: { display: Display | null, position: XY, size: XY };

  constructor(display: Display, game: Game) {
    this.showing = false;
    this._game = game
    this._data = [];
    this._options = {
      display: display,
      position: new XY(),
      size: new XY()
    }
    this.displayBoxPos = new XY(10, 5);
    this.displayBoxSize = new XY(90, 25);

  }

  configure(options: { position: XY, size: XY }) { Object.assign(this._options, options); }

  clear() { this._data = []; }

  write(text: string, append: boolean = false) {
    !append && this.clear();
    this._data.push(text);
    !append && this.flush();
  }

  flush() {
    let o = this._options;
    let d = o.display;
    let pos = o.position;
    let size = o.size;

    // clear
    for (let i = 0; i < size.x; i++) {
      for (let j = 0; j < size.y; j++) {
        d.draw(pos.x + i, pos.y + j);
      }
    }

    let text = this._data.join(" ");
    d.drawText(pos.x, pos.y, text, size.x);
  }

  displayBox(text: string) {
    this.showing = true;
    let o = this._options;
    let d = o.display!;
    let pos = this.displayBoxPos;
    let size = this.displayBoxSize;


    // fill the center with spaces
    for (let i = 0; i < size.x; i++) {
      for (let j = 0; j < size.y; j++) {
        if (i === 0 || i === size.x - 1 || j === 0 || j === size.y - 1) {
          d.draw(pos.x + i, pos.y + j, "/");
        } else {
          d.draw(pos.x + i, pos.y + j, " ");
        }
      }
    }


    let padding = 5
    let textX = pos.x + padding;
    let textY = pos.y + padding;
    d.drawText(textX, textY, text, size.x - padding * 2);
    d.drawText(textX, pos.y + size.y - 3, "(Press <Enter> to continue)", size.x - padding * 2);
  }

  clearDisplayBox() {
    this.showing = false
    let o = this._options;
    let d = o.display!;
    let pos = this.displayBoxPos;
    let size = this.displayBoxSize;
    let xy = new XY()
    for (let i = 0; i < size.x; i++) {
      for (let j = 0; j < size.y; j++) {
        xy.x = pos.x + i
        xy.y = pos.y + j
        this._game.display.draw(xy.x, xy.y, " ")
        this._game.draw(xy)
      }
    }
  }
}
