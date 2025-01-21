import Entity from "../entity";
import Game from "../game";
import EVItem, { KEY as EVKey, COLOR as EVColor } from "../items/ev";

export default class EVRemote extends Entity {
  item: boolean = true

  constructor(game: Game) {
    super(game, { ch: "?", fg: "yellow" });
    this.visible = false;
  }


  onInteract(entity: Entity): boolean {
    let level = entity.getLevel()
    level.textBuffer.displayBox(`This looks like a remote for Electric Vehicle 2. Press %c{${EVColor}}[${EVKey}]%c{} to activate it.`, () => {
      this.remove()
      const remote = new EVItem(this.getLevel()!)
      level.addInventory(remote)
      level.ev.visible = true
      level.draw(level.ev.getXY()!)
    })
    return false;
  }

}

