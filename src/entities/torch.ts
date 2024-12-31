import Entity from "../entity";
import Game from "../game";
import TorchItem from "../items/torch"

export default class Torch extends Entity {
  item: boolean = true

  constructor(game: Game) {
    super(game, { ch: "?", fg: "yellow" });
    this.visible = false;
  }


  onInteract(entity: Entity): boolean {
    let level = entity.getLevel()
    level.textBuffer.displayBox("I found a torch. Press %c{orange}[2]%c{} to activate or deactivate it.", () => {
      this.remove()
      const terminal = new TorchItem(this.getLevel()!)
      level.addInventory(terminal)
    })
    return false;
  }

}

