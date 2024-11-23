import Entity from "../entity";
import Game from "../game";
import TerminalItem from "../items/terminal"

export default class Terminal extends Entity {
  constructor(game: Game) {
    super(game, { ch: "#", fg: "green" });
  }


  onInteract(entity: Entity): boolean {
    let level = entity.getLevel()
    level.textBuffer.displayBox("You found a terminal reader. It will be available in your inventory. To activate it, press [0]. When activated, it can identify log signatures (%c{green}+%c{}) that you can read.", () => {
      this.remove()
      level.addInventory(new TerminalItem(this.getLevel()!))
    })
    return false;
  }

}

