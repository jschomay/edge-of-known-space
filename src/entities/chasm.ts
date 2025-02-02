import Entity from "../entity";
import Game from "../game";
import Bridge from "./bridge";

export default class Chasm extends Entity {
  river: boolean

  constructor(game: Game, river: boolean = false) {
    let ch = river ? "~" : " "
    super(game, { ch: ch, fg: "red" });
    this.visible = false
    this.river = river
  }

  onInteract(entity: Entity): boolean {
    let entityUnderPlayer = this.getLevel()!.getEntityAt(this.getLevel().player.getXY()!)
    if (entityUnderPlayer instanceof Bridge) {
      this.getLevel()!.textBuffer.write("Careful!")
    } else {
      let msg = this.river
        ? "A deep crimson river cuts across the ground here. I'll need to find some other way across."
        : "The ground splits into a bottomless chasm, I cannot pass."
      this.getLevel()!.textBuffer.write(msg)
    }
    return false;
  }

}
