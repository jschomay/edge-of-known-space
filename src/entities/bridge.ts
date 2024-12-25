import Entity from "../entity";
import Game from "../game";

export default class Bridge extends Entity {
  deployed: boolean
  broken: boolean

  constructor(game: Game, deployed: boolean = false, broken: boolean = false) {
    super(game, { ch: "?", fg: "yellow" });
    this.broken = broken
    this.deployed = deployed
    this.visible = deployed
  }

  getVisual() {
    return this.deployed
      ? { ch: "I", fg: "#aaa" }
      : { ch: "?", fg: "yellow" }
  }

  onInteract(entity: Entity): boolean {
    if (this.broken) {
      this.getLevel()!.textBuffer.write("A bridge was set up across the chasm. However, it has collapsed.")
      return false;
    } else if (!this.deployed) {
      this.getLevel().textBuffer.displayBox("This is a portable, deployable bridge. Press %c{purple}[3]%c{} to use it.",
        () => {
          this.remove()
          // TODO
          // const terminal = new TorchItem(this.getLevel()!)
          // level.addInventory(terminal)
        })
      return false
    } else {
      return true
    }
  }
}
