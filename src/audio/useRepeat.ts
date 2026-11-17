import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioRecorder,
} from 'expo-audio';
import { useCallback, useState } from 'react';

/** Record the learner repeating after the model, then play their voice back. */
export function useRepeat() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const player = useAudioPlayer();
  const [recording, setRecording] = useState(false);
  const [myVoice, setMyVoice] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);

  const start = useCallback(async () => {
    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) {
      setDenied(true);
      return;
    }
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    setRecording(true);
  }, [recorder]);

  /** Stops recording; returns the recording uri. */
  const stop = useCallback(async () => {
    if (!recording) return null;
    await recorder.stop();
    setRecording(false);
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
    const uri = recorder.uri;
    setMyVoice(uri);
    return uri;
  }, [recorder, recording]);

  const playMine = useCallback(
    (uri = myVoice) => {
      if (!uri) return;
      player.replace({ uri });
      player.seekTo(0);
      player.play();
    },
    [player, myVoice],
  );

  const reset = useCallback(() => setMyVoice(null), []);

  return { start, stop, playMine, reset, recording, myVoice, denied };
}
