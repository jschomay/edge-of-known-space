import Entity from "../entity";
import Game from "../game";
import pubsub from "../pubsub";
import Terminal from "./terminal";

let interactionCount = 0;

export default class Log extends Entity {
  private log: string = "!!"

  constructor(game: Game) {
    super(game, { ch: "+", fg: "yellow" });
    this._visible = false
  }

  setLog(text: string) {
    this.log = text
    return this;
  }

  onInteract(entity: Entity): boolean {
    this.getLevel().textBuffer.displayBox(this.log, () => this.remove())
    return false;
  }

}
