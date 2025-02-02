import { Color, RNG } from "../../lib/rotjs";
import Entity from "../entity";
import Game from "../game";

export default class CrystalShard extends Entity {
  visible = false

  constructor(game: Game) {
    super(game, { ch: "*", fg: "purple" });
    setInterval(() => {
      let multiplier = RNG.getUniform() * 150 + 10
      let colorString = RNG.getItem(["darkgray", "blue"])
      let color = Color.add(Color.fromString(colorString!), [multiplier, multiplier, multiplier])

      this.setVisual({ fg: Color.toRGB(color) })
      this.getLevel().draw(this.getXY()!)
    }, 100);
  }

  onInteract(entity: Entity): boolean {
    const xy = this.getXY()
    this.getLevel()!.textBuffer.displayBox("Another crystal shard! I can feel it buzzing with energy. My equipment seems to respond as well...", () => {
      this.remove()
      // TODO power up
    })
    return false;
  }

}
