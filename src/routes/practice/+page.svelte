<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import AudioVisualizer from '$lib/components/AudioVisualizer.svelte';
  import { getMicrophoneStream } from '$lib/utils/audio';
  
  let stream = $state<MediaStream | null>(null);
  let isRecording = $state(false);
  let mediaRecorder = $state<MediaRecorder | null>(null);
  let recordingDuration = $state(0);
  let recordingTimer = $state<ReturnType<typeof setInterval> | null>(null);
  
  async function startRecording() {
    try {
      stream = await getMicrophoneStream();
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorder.start();
      isRecording = true;
      recordingDuration = 0;
      
      recordingTimer = setInterval(() => {
        recordingDuration++;
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '無法開始錄音';
      alert('無法開始錄音：' + errorMessage);
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
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    
    isRecording = false;
  }
  
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  
  onDestroy(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (recordingTimer) {
      clearInterval(recordingTimer);
    }
  });
</script>

<svelte:head>
  <title>練習模式 - KaraLab</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">練習模式</h1>
  
  <div class="card mb-6">
    <h2 class="text-xl font-semibold mb-4">麥克風視覺化</h2>
    <AudioVisualizer width={800} height={300} />
  </div>
  
  <div class="card">
    <h2 class="text-xl font-semibold mb-4">錄音功能</h2>
    
    <div class="text-center mb-6">
      {#if isRecording}
        <div class="text-4xl mb-4">🔴</div>
        <div class="text-3xl font-bold mb-4">{formatTime(recordingDuration)}</div>
        <button
          class="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          onclick={stopRecording}
        >
          停止錄音
        </button>
      {:else}
        <div class="text-4xl mb-4">🎤</div>
        <button
          class="btn-primary text-lg px-8 py-3"
          onclick={startRecording}
        >
          開始錄音
        </button>
      {/if}
    </div>
    
    <p class="text-sm text-gray-600 dark:text-gray-400 text-center">
      錄音功能開發中，請使用錄音頁面進行完整錄音
    </p>
  </div>
</div>
