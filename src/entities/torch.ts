import Entity from "../entity";
import Game from "../game";
import TorchItem from "../items/torch"

export default class Torch extends Entity {
  constructor(game: Game) {
    super(game, { ch: "A", fg: "orange" });
    this.visible = false;
  }


  onInteract(entity: Entity): boolean {
    let level = entity.getLevel()
    level.textBuffer.displayBox("I found a torch. Press %c{orange}[1]%c{} to activate or deactivate it.", () => {
      this.remove()
      const terminal = new TorchItem(this.getLevel()!)
      level.addInventory(terminal)
    })
    return false;
  }

}

