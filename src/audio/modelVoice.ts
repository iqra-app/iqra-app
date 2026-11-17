import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import type { Item } from '../content/types';

let player: AudioPlayer | null = null;

/**
 * Plays the model pronunciation of an item.
 * A reciter's recording is used when the item has one; otherwise a placeholder
 * synthetic Arabic voice speaks it (not tajwid-accurate, to be replaced).
 */
export function playModel(item: Item, opts: { slow?: boolean; onDone?: () => void } = {}) {
  stopModel();
  if (item.audio != null) {
    player = createAudioPlayer(item.audio);
    player.setPlaybackRate(opts.slow ? 0.7 : 1);
    const sub = player.addListener('playbackStatusUpdate', (s) => {
      if (s.didJustFinish) {
        sub.remove();
        opts.onDone?.();
      }
    });
    player.play();
    return;
  }
  Speech.speak(item.speak, { language: 'ar', rate: opts.slow ? 0.55 : 0.85, onDone: opts.onDone });
}

export function stopModel() {
  Speech.stop();
  if (player) {
    player.remove();
    player = null;
  }
}

/** Plays the model `times` times in a row, with a short pause between. */
export function playModelRepeated(item: Item, times: number, opts: { slow?: boolean } = {}) {
  let left = times;
  const next = () => {
    left -= 1;
    if (left > 0) setTimeout(() => playModel(item, { ...opts, onDone: next }), 600);
  };
  playModel(item, { ...opts, onDone: next });
}
