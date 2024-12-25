import Entity from "../entity";
import Game from "../game";
import TerminalItem from "../items/terminal"

export default class Terminal extends Entity {
  constructor(game: Game) {
    super(game, { ch: "?", fg: "yellow" });
  }


  onInteract(entity: Entity): boolean {
    let level = entity.getLevel()
    level.textBuffer.displayBox("I found a terminal reader. It is now in my inventory. Press %c{green}[0]%c{} to activate or deactivate it. When activated, it can reveal hidden logs (%c{yellow}+%c{}) and other equipment near me.", () => {
      this.remove()
      const terminalItem = new TerminalItem(this.getLevel()!)
      level.addInventory(terminalItem)
      level.activateItem(terminalItem.key)
    })
    return false;
  }

}

