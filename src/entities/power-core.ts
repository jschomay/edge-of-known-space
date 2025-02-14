import Entity from "../entity";
import Game from "../game";


export default class PowerCore extends Entity {
  constructor(game: Game) {
    super(game, { ch: "?", fg: "violet" });

  }

  onInteract(entity: Entity): boolean {
    this.getLevel()!.textBuffer.displayBox(`
I found a spare power cell. It's not full, but it still has plenty juice left.
`.trim(), () => {
      this.getLevel().battery = 3
      this.getLevel().drawPower()
      this.remove()
    })
    return false;
  }

}
