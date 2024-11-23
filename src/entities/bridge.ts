import Entity from "../entity";
import Game from "../game";

export default class Bridge extends Entity {
  private broken: boolean

  constructor(game: Game, broken: boolean = false) {
    super(game, { ch: "I", fg: "#aaa" });
    this.broken = broken
  }

  onInteract(entity: Entity): boolean {
    if (this.broken) {
      this.getLevel()!.textBuffer.write("A bridge was set up across the chasm. However, it has collapsed.")
      return false;
    }
    return true
  }

}
