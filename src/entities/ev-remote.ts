import Entity from "../entity";
import Game from "../game";
import EVItem from "../items/ev";

export default class EVRemote extends Entity {
  item: boolean = true

  constructor(game: Game) {
    super(game, { ch: "?", fg: "yellow" });
    this.visible = false;
  }


  onInteract(entity: Entity): boolean {
    let level = entity.getLevel()
    level.textBuffer.displayBox("This looks like a remote for Electric Vehicle 2. Press %c{#d00}[5]%c{} to activate it.", () => {
      this.remove()
      const remote = new EVItem(this.getLevel()!)
      level.addInventory(remote)
    })
    return false;
  }

}

