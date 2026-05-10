export const AUDIO_PATHS = {
  bg: {
    happy: '/audio/bg/happy_loop.mp3',
    calm: '/audio/bg/calm_kids_loop.mp3',
  },
  sfx: {
    click: '/audio/sfx/click.mp3',
    wrong: '/audio/sfx/wrong.mp3',
    strokeSuccess: '/audio/sfx/stroke_success.mp3',
    levelComplete: '/audio/sfx/level_complete.mp3',
    tracingStart: '/audio/sfx/tracing_start.mp3',
    tracingMove: '/audio/sfx/tracing_move.mp3',
  },
};

let bgAudio: HTMLAudioElement | null = null;
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;

  if (!enabled && bgAudio) {
    bgAudio.pause();
  }
}

export function getSoundEnabled() {
  return soundEnabled;
}

export function playSfx(src: string, volume = 0.7) {
  if (!soundEnabled) return;

  const audio = new Audio(src);
  audio.volume = volume;
  audio.currentTime = 0;

  audio.play().catch(() => {
    // iOS/Safari có thể chặn nếu chưa có tương tác người dùng
  });
}

export function startBackgroundMusic(src = AUDIO_PATHS.bg.happy, volume = 0.25) {
  if (!soundEnabled) return;

  if (!bgAudio) {
    bgAudio = new Audio(src);
    bgAudio.loop = true;
    bgAudio.volume = volume;
  }

  bgAudio.play().catch(() => {
    // iOS/Safari cần user tương tác trước khi phát nhạc
  });
}

export function stopBackgroundMusic() {
  if (!bgAudio) return;

  bgAudio.pause();
  bgAudio.currentTime = 0;
}