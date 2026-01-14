<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { queue } from '$lib/stores/queue';
  import { recordings } from '$lib/stores/recordings';
  import { settings } from '$lib/stores/settings';
  import { getAudioDuration } from '$lib/utils/audio';
  import YouTubePlayer from '$lib/components/YouTubePlayer.svelte';
  import type { QueueItem } from '$lib/types';
  
  let playerRef = $state<YouTubePlayer | null>(null);
  
  let currentVideoId = $derived($page.params.id);
  
  // Recording state
  let recordingStream = $state<MediaStream | null>(null);
  let isRecording = $state(false);
  let mediaRecorder = $state<MediaRecorder | null>(null);
  let recordingDuration = $state(0);
  let recordingTimer = $state<ReturnType<typeof setInterval> | null>(null);
  let recordingChunks = $state<Blob[]>([]);
  let recordingReady = $state(false);
  
  // Capture song info when recording starts (before video is removed from queue)
  let recordingSongName = $state<string>('');
  let recordingSongId = $state<string>('');
  
  // Video playback state
  let isVideoPlaying = $state(false);
  
  // Check if recording is enabled
  let recordingEnabled = $derived($settings.recordingEnabled);
  
  // Get current video info from queue (may not exist if already removed)
  let currentVideo = $derived($queue.find(item => item.video.id === currentVideoId)?.video);
  
  function handleVideoEnded() {
    // Stop recording when video ends
    stopRecording();
    
    // Auto-play next item in queue (current video was already removed when it started playing)
    const nextItem = queue.next() as QueueItem | null;
    if (nextItem?.video?.id) {
      // Navigate to next video in queue
      goto(`/player/${nextItem.video.id}`, { replaceState: true });
    }
  }
  
  async function prepareRecording(): Promise<boolean> {
    // If recording is disabled, always return true (ready)
    if (!recordingEnabled) {
      recordingReady = true;
      return true;
    }
    
    // Don't prepare if already recording
    if (isRecording) {
      recordingReady = true;
      return true;
    }
    
    try {
      const { getMicrophoneStream } = await import('$lib/utils/audio');
      recordingStream = await getMicrophoneStream();
      recordingChunks = [];
      
      mediaRecorder = new MediaRecorder(recordingStream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        // Capture the duration before it might be reset
        const savedDuration = recordingDuration;
        
        const blob = new Blob(recordingChunks, { type: 'audio/webm' });
        
        // Only save if there's actual recording data
        if (blob.size === 0 || recordingChunks.length === 0) {
          recordingChunks = [];
          recordingDuration = 0;
          return;
        }
        
        const url = URL.createObjectURL(blob);
        
        // Try to get duration from blob, fallback to recorded duration
        let duration = 0;
        try {
          duration = await getAudioDuration(blob);
          // If duration is 0 or invalid, use the recorded duration from timer
          if (!duration || isNaN(duration) || duration === 0) {
            duration = savedDuration;
          }
        } catch (err) {
          // If getAudioDuration fails, use the recorded duration from timer
          duration = savedDuration;
        }
        
        // Only save if duration > 0
        if (duration > 0) {
          const recording: import('$lib/types').Recording = {
            id: crypto.randomUUID(),
            songId: recordingSongId || currentVideoId || '',
            songName: recordingSongName || currentVideo?.title || `錄音 ${new Date().toLocaleString('zh-TW')}`,
            audioBlob: blob,
            url: url,
            date: new Date(),
            duration: duration,
            aiEvaluation: null
          };
          
          recordings.add(recording);
        }
        
        // Reset for next recording
        recordingChunks = [];
        recordingDuration = 0;
      };
      
      recordingReady = true;
      return true;
    } catch (err) {
      recordingReady = false;
      const errorMessage = err instanceof Error ? err.message : '無法準備錄音';
      alert('無法準備錄音：' + errorMessage);
      return false;
    }
  }
  
  async function startRecording() {
    // Don't start if already recording or recording disabled
    if (isRecording || !recordingEnabled) return;
    
    if (mediaRecorder && recordingStream) {
      // Capture song info before starting recording (in case video is removed from queue)
      recordingSongName = currentVideo?.title || `錄音 ${new Date().toLocaleString('zh-TW')}`;
      recordingSongId = currentVideoId || '';
      
      mediaRecorder.start();
      isRecording = true;
      recordingDuration = 0;
      
      recordingTimer = setInterval(() => {
        recordingDuration++;
      }, 1000);
    }
  }
  
  async function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    
    if (recordingTimer) {
      clearInterval(recordingTimer);
      recordingTimer = null;
    }
    
    isRecording = false;
    // Don't reset recordingDuration here - it's needed in onstop handler
    // It will be reset when recording starts again
    // Don't stop the stream here - keep it alive for potential resume
    // The stream will be stopped when component is destroyed
  }
  
  function handleVideoPlay() {
    isVideoPlaying = true;
    if (recordingEnabled) {
      startRecording();
    }
  }
  
  function handleVideoPause() {
    isVideoPlaying = false;
    /*
    if (recordingEnabled) {
      stopRecording();
    }
      */
  }
  
  async function togglePlayPause() {
    if (!playerRef) return;
    
    if (isVideoPlaying) {
      playerRef.pause();
    } else {
      // Check if recording is ready before playing (if recording is enabled)
      if (recordingEnabled && !recordingReady) {
        const ready = await prepareRecording();
        if (!ready) {
          return; // Don't play if recording preparation failed
        }
      }
      playerRef.play();
    }
  }
  
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  // Prepare recording when component mounts (if recording is enabled)
  onMount(async () => {
    if (recordingEnabled) {
      await prepareRecording();
    } else {
      recordingReady = true;
    }
  });
  
  onDestroy(() => {
    // Stop video playback first
    if (playerRef) {
      try {
        playerRef.pause();
      } catch (e) {
        // Ignore errors if player is already destroyed
        console.warn('Failed to pause player on destroy:', e);
      }
    }
    
    // Stop recording properly to ensure onstop handler runs and saves any recording
    // This must be done before cleaning up the stream
    if (isRecording && mediaRecorder) {
      try {
        if (mediaRecorder.state === 'recording') {
          // Stop the recorder - this will trigger onstop handler
          mediaRecorder.stop();
        }
      } catch (e) {
        console.warn('Failed to stop recording on destroy:', e);
      }
    }
    
    // Clean up recording timer
    if (recordingTimer) {
      clearInterval(recordingTimer);
      recordingTimer = null;
    }
    
    // Stop recording stream tracks (this will stop the microphone)
    // Note: The MediaRecorder's onstop handler will run asynchronously
    // but the stream can be stopped immediately as the chunks are already captured
    if (recordingStream) {
      recordingStream.getTracks().forEach(track => track.stop());
      recordingStream = null;
    }
  });
</script>

<svelte:head>
  <title>播放器 - KaraLab</title>
</svelte:head>

<div class="h-[calc(100vh-64px)] flex flex-col">
  <!-- YouTube Player -->
  <div class="flex-1 min-h-0">
    {#if currentVideoId}
      <YouTubePlayer 
        bind:this={playerRef}
        videoId={currentVideoId}
        autoplay={recordingReady}
        onEnded={handleVideoEnded}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        canPlay={async () => {
          // If recording is disabled, always allow playback
          if (!recordingEnabled) return true;
          // If recording is already ready, allow playback
          if (recordingReady) return true;
          // Otherwise, prepare recording first
          return await prepareRecording();
        }}
      />
    {/if}
  </div>
  
  <!-- Recording Section - Minimal UI with Play/Pause Controls -->
  <div class="mx-4 mb-4 flex items-center justify-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2">
    <button
      class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      onclick={togglePlayPause}
      aria-label={isVideoPlaying ? '暫停' : '播放'}
    >
      {#if isVideoPlaying}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      {/if}
    </button>
    <div class="text-2xl">{isRecording ? '🔴' : '🎤'}</div>
    <div class="text-lg font-mono font-semibold">{formatTime(recordingDuration)}</div>
  </div>
</div>
