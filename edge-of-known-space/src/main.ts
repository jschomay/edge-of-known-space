import './style.css'
import Game from './game'



window.addEventListener("load", handleEvent);

function handleEvent(e: Event) {
  switch (e.type) {
    case "load":
      new Game();
  }
  window.removeEventListener("load", handleEvent);
}

