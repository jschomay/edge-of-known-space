import Game from "../game";
import Entity from "../entity";
import Ship from "./ship";

export function entityFromCh(ch: string, game: Game) {
  // ignore special entities marked on map (only for convenience)
  // markers on ground terrain:
  if ("@t.".includes(ch.toLowerCase())) return new Entity(game, { ch: ".", fg: "grey" });

  switch (ch.toLowerCase()) {
    case "o": return new Ship(game);
    default: return new Entity(game);
  }
}
