import Entity from "../entity";
import Game from "../game";
import Bridge from "./bridge";

export default class Chasm extends Entity {

  constructor(game: Game) {
    super(game, { ch: "~", fg: "red" });
    this.visible = false
  }

  onInteract(entity: Entity): boolean {
    let entityUnderPlayer = this.getLevel()!.getEntityAt(this.getLevel().player.getXY()!)
    if (entityUnderPlayer instanceof Bridge) {
      this.getLevel()!.textBuffer.write("Careful!")
    } else {
      this.getLevel()!.textBuffer.write("A deep crimson river cuts across the ground here. I'll need to find some other way across.")
    }
    return false;
  }

}
