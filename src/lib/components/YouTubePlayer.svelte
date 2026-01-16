<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  
  interface Props {
    videoId: string;
    autoplay?: boolean;
    onEnded?: () => void;
    onPlay?: () => void;
    onPause?: () => void;
    canPlay?: () => boolean | Promise<boolean>;
  }
  
  let { videoId, autoplay = false, onEnded, onPlay, onPause, canPlay }: Props = $props();
  
  let playerId = $derived(`youtube-player-${videoId}-${Math.random().toString(36).substr(2, 9)}`);
  // Store player as plain variable outside reactivity to avoid proxy issues
  let player: YT.Player | null = null;
  let playerReady = $state(false); // Track when player is fully initialized
  let iframeRef = $state<HTMLIFrameElement | null>(null);
  let containerRef = $state<HTMLDivElement | null>(null);
  let apiReady = $state(false);
  let isPlaying = $state(false);
  
  // Expose control methods
  export async function play() {
    if (!player) {
      return;
    }
    
    // Wait for player to be ready if not yet ready
    if (!playerReady) {
      // Wait up to 3 seconds for player to be ready
      const startTime = Date.now();
      while (!playerReady && (Date.now() - startTime) < 3000) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      if (!playerReady) {
        return;
      }
    }
    
    // Check if playback is allowed
    if (canPlay) {
      const allowed = await canPlay();
      if (!allowed) {
        console.log('Playback blocked: recording not ready');
        return;
      }
    }
    
    try {
      player.playVideo();
    } catch (e) {
      console.error('Failed to play video:', e);
    }
  }
  
  export function pause() {
    if (player) {
      try {
        player.pauseVideo();
      } catch (e) {
        console.error('Failed to pause video:', e);
      }
    }
  }
  
  // Load YouTube IFrame API
  onMount(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      apiReady = true;
      initPlayer();
    } else {
      // Load the API script
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }
      
      // Store original callback if exists
      const originalCallback = window.onYouTubeIframeAPIReady;
      
      // Wait for API to be ready
      window.onYouTubeIframeAPIReady = () => {
        apiReady = true;
        if (originalCallback) originalCallback();
        initPlayer();
      };
    }
    
  });
  
  onDestroy(() => {
    if (player) {
      try {
        player.destroy();
      } catch (e) {
        // Ignore errors during cleanup
      }
    }
  });
  
  function initPlayer() {
    if (!apiReady || !window.YT || !window.YT.Player) return;
    
    try {
      playerReady = false;
      // Pass the div ID - YouTube API will replace it with an iframe
      player = new window.YT.Player(playerId, {
        videoId: videoId,
        playerVars: {
          autoplay: autoplay ? 1 : 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1
        },
        events: {
          onReady: (event: { target: YT.Player }) => {
            // Use event.target as the actual player object with API methods
            player = event.target;
            playerReady = true;
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            // YT.PlayerState.ENDED = 0, PLAYING = 1, PAUSED = 2
            if (event.data === 0) {
              // ENDED
              isPlaying = false;
              if (onEnded) onEnded();
            } else if (event.data === 1) {
              // PLAYING
              isPlaying = true;
              if (onPlay) onPlay();
            } else if (event.data === 2) {
              // PAUSED
              isPlaying = false;
              if (onPause) onPause();
            }
          }
        }
      });
    } catch (e) {
      console.error('Failed to initialize YouTube player:', e);
    }
  }
  
  // Reinitialize player when videoId changes
  $effect(() => {
    if (apiReady && videoId) {
      // Small delay to ensure iframe is ready
      setTimeout(() => {
        initPlayer();
      }, 100);
    }
  });
</script>

<div 
  bind:this={containerRef}
  class="relative w-full h-full bg-black"
>
  <!-- Let YouTube IFrame API create the iframe, don't pre-create it -->
  <div
    id={playerId}
    class="w-full h-full"
  ></div>
</div>
