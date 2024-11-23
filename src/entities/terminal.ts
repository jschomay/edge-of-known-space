import Entity from "../entity";
import Game from "../game";
import TerminalItem from "../items/terminal"

export default class Terminal extends Entity {
  constructor(game: Game) {
    super(game, { ch: "#", fg: "green" });
  }


  onInteract(entity: Entity): boolean {
    let level = entity.getLevel()
    level.textBuffer.displayBox("You find a terminal reader. It will be added to your inventory. Press %c{green}[0]%c{} to activate or deactivate it. When activated, it can reveal hidden logs (%c{yellow}+%c{}).", () => {
      this.remove()
      const terminal = new TerminalItem(this.getLevel()!)
      level.addInventory(terminal)
      level.activateItem(terminal.key)
    })
    return false;
  }

}

