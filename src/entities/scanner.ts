import Entity from "../entity";
import Game from "../game";
import ScannerItem from "../items/scanner";

export default class Scanner extends Entity {
  item: boolean = true

  constructor(game: Game) {
    super(game, { ch: "?", fg: "#55f" });
    this.visible = false;
  }


  onInteract(entity: Entity): boolean {
    let level = entity.getLevel()
    level.textBuffer.displayBox("This is Dr. Balthar's scanner. Press %c{#55f}[3]%c{} to activate it.", () => {
      this.remove()
      const terminal = new ScannerItem(this.getLevel()!)
      level.addInventory(terminal)
    })
    return false;
  }

}

