// YouTube IFrame API Types
declare namespace YT {
  interface PlayerState {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  }

  interface OnStateChangeEvent {
    data: number;
    target: Player;
  }

  interface PlayerVars {
    autoplay?: 0 | 1;
    controls?: 0 | 1 | 2;
    rel?: 0 | 1;
    modestbranding?: 0 | 1;
    enablejsapi?: 0 | 1;
    origin?: string;
  }

  interface PlayerOptions {
    videoId?: string;
    width?: number | string;
    height?: number | string;
    playerVars?: PlayerVars;
    events?: {
      onReady?: (event: { target: Player }) => void;
      onStateChange?: (event: OnStateChangeEvent) => void;
      onError?: (event: { data: number; target: Player }) => void;
    };
  }

  class Player {
    constructor(id: string | HTMLElement, options: PlayerOptions);
    destroy(): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead?: boolean): void;
    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): number;
    getVideoUrl(): string;
    getVideoEmbedCode(): string;
  }

  const PlayerState: PlayerState;
}

interface Window {
  YT: typeof YT;
  onYouTubeIframeAPIReady?: () => void;
}
