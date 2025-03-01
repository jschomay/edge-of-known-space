import { Color, RNG } from "../../lib/rotjs";
import Entity from "../entity";
import Game from "../game";

export const KEY = "∆"

export default class CrystalShard extends Entity {
  visible = false
  intervalId: number = -1

  constructor(game: Game) {
    super(game, { ch: KEY, fg: "purple" });
    this.intervalId = setInterval(() => {
      let multiplier = RNG.getUniform() * 150 + 10
      let colorString = RNG.getItem(["darkgray", "blue"])
      let color = Color.add(Color.fromString(colorString!), [multiplier, multiplier, multiplier])

      this.setVisual({ fg: Color.toRGB(color) })
      this.getLevel().draw(this.getXY()!)
    }, 100);
  }

  onInteract(entity: Entity): boolean {
    const xy = this.getXY()
    this.getLevel()!.textBuffer.displayBox("A crystal shard! I can feel it buzzing with energy. My equipment seems to respond as well...", () => {
      this.remove()
      clearInterval(this.intervalId)
      this.getLevel().powerLevel++
      this.getLevel().battery = 5
      this.getLevel().drawPower()
      this.getLevel().drawNewShard()
      this.getLevel().updateFOV()
    })
    return false;
  }

}
