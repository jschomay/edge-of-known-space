import Entity from "../entity";
import Game from "../game";
import BridgeItem, { KEY as BRIDGE_KEY } from "../items/bridge";

export type Opts = { broken?: boolean, asItem?: boolean, suspended?: boolean }

// bridge is both the item to pick up and a deployed special entity
export default class Bridge extends Entity {
  item: boolean

  deployed: boolean
  broken: boolean
  suspended: boolean

  constructor(game: Game, opts: Opts) {
    super(game, { ch: "?", fg: "gray" });
    this.broken = !!opts.broken
    this.suspended = !!opts.suspended // over river
    this.deployed = !opts.asItem // deployed by default

    this.item = !!opts.asItem
    this.visible = !this.item // only hidden when item
  }

  getVisual() {
    return this.item
      ? { ch: "?", fg: "gray" }
      : { ch: "I", fg: "#aaa" }
  }

  onInteract(entity: Entity): boolean {
    if (this.broken) {
      this.getLevel()!.textBuffer.write("An energy bridge was set up across the river. However, it isn't working, mabye the power is drained.")
      return false;
    } else if (!this.deployed) {
      this.getLevel().textBuffer.displayBox(`I now have a deployable energy bridge. Press %c{gray}[${BRIDGE_KEY}]%c{} near a river to deploy or retract it.`,
        () => {
          this.remove()
          const bridge = new BridgeItem(this.getLevel())
          this.getLevel().addInventory(bridge)
        })
      return false
    } else {
      return true
    }
  }
}
