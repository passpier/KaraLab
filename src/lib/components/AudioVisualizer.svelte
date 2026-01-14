<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { initAudioContext, createAudioAnalyzer, getMicrophoneStream } from '$lib/utils/audio';
  
  interface Props {
    width?: number;
    height?: number;
  }
  
  let { width = 400, height = 200 }: Props = $props();
  
  let canvasRef = $state<HTMLCanvasElement | null>(null);
  let audioContext = $state<AudioContext | null>(null);
  let analyser = $state<AnalyserNode | null>(null);
  let dataArray = $state<Uint8Array | null>(null);
  let animationFrameId = $state<number | null>(null);
  let stream = $state<MediaStream | null>(null);
  let isActive = $state(false);
  
  async function startVisualization() {
    try {
      audioContext = await initAudioContext();
      stream = await getMicrophoneStream();
      const analyzerData = createAudioAnalyzer(stream, audioContext);
      analyser = analyzerData.analyser;
      // Create a new Uint8Array to avoid ArrayBufferLike type issues
      dataArray = new Uint8Array(analyzerData.dataArray);
      isActive = true;
      draw();
    } catch (error) {
      console.error('Failed to start visualization:', error);
      alert('無法存取麥克風，請檢查權限設定');
    }
  }
  
  function stopVisualization() {
    isActive = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
  }
  
  function draw() {
    if (!isActive || !canvasRef || !analyser || !dataArray) return;
    
    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // @ts-expect-error - TypeScript strict ArrayBuffer typing issue, but this works at runtime
    analyser.getByteFrequencyData(dataArray);
    
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);
    
    const barWidth = width / dataArray.length * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      barHeight = (dataArray[i] / 255) * height;
      
      const r = barHeight + 25 * (i / dataArray.length);
      const g = 250 * (i / dataArray.length);
      const b = 50;
      
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
    
    animationFrameId = requestAnimationFrame(draw);
  }
  
  onDestroy(() => {
    stopVisualization();
  });
</script>

<div class="flex flex-col items-center gap-4">
  <canvas 
    bind:this={canvasRef}
    width={width} 
    height={height}
    class="border border-gray-300 dark:border-gray-600 rounded-lg"
  ></canvas>
  
  <div class="flex gap-2">
    {#if !isActive}
      <button 
        class="btn-primary"
        onclick={startVisualization}
      >
        開始視覺化
      </button>
    {:else}
      <button 
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        onclick={stopVisualization}
      >
        停止視覺化
      </button>
    {/if}
  </div>
</div>
