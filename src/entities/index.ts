import Game from "../game";
import Entity from "../entity";
import Ship from "./ship";
import Player from "./player";

export function entityFromCh(ch: string, game: Game) {
  switch (ch) {
    case "o": return new Ship(game);
    case ".": return new Entity(game, { ch: ".", fg: "grey" });
    default: return new Entity(game);
  }
}
