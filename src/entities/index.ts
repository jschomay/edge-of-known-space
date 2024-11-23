import Game from "../game";
import Entity from "../entity";
import Ship from "./ship";
import Cliff from "./cliff";
import Crystal from "./crystal";
import Bridge from "./bridge";
import Chasm from "./chasm";

export function entityFromCh(ch: string, game: Game) {
  // ignore special entities marked on map (only for convenience)
  // markers on ground terrain:
  if ("@t+.".includes(ch.toLowerCase())) return new Entity(game, { ch: ".", fg: "#444" });

  // ground terrains / static entities
  switch (ch.toLowerCase()) {
    case "o": return new Ship(game);
    case "=": return new Cliff(game);
    case "/": return new Crystal(game);
    case ":": return new Bridge(game, true);
    case "~": return new Chasm(game);
    default: return new Entity(game, { ch: ch, fg: "grey" });
  }
}
