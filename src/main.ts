import './style.css'
import Game from './game'



window.addEventListener("load", handleEvent);

function handleEvent(e: Event) {
  switch (e.type) {
    case "load":
      loadFile("public/bg.ogg").then((track) => {
        document.querySelector("p")?.remove()
        new Game(() => startBgMusic(track))
      });
  }
  window.removeEventListener("load", handleEvent);
}



const audioCtx = new AudioContext();


async function loadFile(filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

function playTrack(audioBuffer) {
  const trackSource = audioCtx.createBufferSource();
  trackSource.buffer = audioBuffer;
  trackSource.connect(audioCtx.destination);
  trackSource.start();
  trackSource.loop = true;
  return trackSource;
}

function startBgMusic(track) {
  // Check if context is in suspended state (autoplay policy)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  playTrack(track);
}
