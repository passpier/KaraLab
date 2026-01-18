<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { initAudioContext, createAudioAnalyzer, getMicrophoneStream } from '$lib/utils/audio';
  
  interface Props {
    width?: number;
    height?: number;
    stream?: MediaStream | null;
    active?: boolean;
    showControls?: boolean;
    responsive?: boolean;
  }
  
  let {
    width = 400,
    height = 200,
    stream: externalStream = null,
    active = false,
    showControls = true,
    responsive = false
  }: Props = $props();
  
  let containerRef = $state<HTMLDivElement | null>(null);
  let canvasRef = $state<HTMLCanvasElement | null>(null);
  let audioContext = $state<AudioContext | null>(null);
  let analyser = $state<AnalyserNode | null>(null);
  let dataArray = $state<Uint8Array | null>(null);
  let animationFrameId = $state<number | null>(null);
  let stream = $state<MediaStream | null>(null);
  let isActive = $state(false);
  let ownsStream = $state(false);
  let errorMessage = $state<string | null>(null);
  let resizeObserver = $state<ResizeObserver | null>(null);
  let resolvedWidth = $state(0);
  let resolvedHeight = $state(0);

  function updateCanvasSize() {
    if (!containerRef) return;
    const rect = containerRef.getBoundingClientRect();
    if (rect.width) {
      resolvedWidth = Math.max(1, Math.floor(rect.width));
    }
    if (rect.height) {
      resolvedHeight = Math.max(1, Math.floor(rect.height));
    }
  }
  
  async function startVisualization() {
    try {
      if (isActive) return;
      errorMessage = null;
      audioContext = await initAudioContext();
      if (externalStream) {
        stream = externalStream;
        ownsStream = false;
      } else {
        stream = await getMicrophoneStream();
        ownsStream = true;
      }
      const analyzerData = createAudioAnalyzer(stream, audioContext);
      analyser = analyzerData.analyser;
      // Create a new Uint8Array to avoid ArrayBufferLike type issues
      dataArray = new Uint8Array(analyzerData.dataArray);
      isActive = true;
      draw();
    } catch (error) {
      console.error('Failed to start visualization:', error);
      errorMessage = '無法存取麥克風，請檢查權限設定';
    }
  }
  
  function stopVisualization() {
    isActive = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (stream && ownsStream) {
      stream.getTracks().forEach(track => track.stop());
    }
    stream = null;
    ownsStream = false;
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
    
    const currentWidth = resolvedWidth || width;
    const currentHeight = resolvedHeight || height;

    ctx.clearRect(0, 0, currentWidth, currentHeight);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(0, 0, currentWidth, currentHeight);
    
    const barWidth = currentWidth / dataArray.length * 2.5;
    let barHeight;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      barHeight = (dataArray[i] / 255) * currentHeight;
      const hue = 190 + (i / dataArray.length) * 120;
      ctx.fillStyle = `hsl(${hue} 85% 55%)`;
      ctx.fillRect(x, currentHeight - barHeight, barWidth, barHeight);
      
      x += barWidth + 1;
    }
    
    animationFrameId = requestAnimationFrame(draw);
  }
  
  onDestroy(() => {
    stopVisualization();
    if (resizeObserver && containerRef) {
      resizeObserver.unobserve(containerRef);
    }
  });
  
  onMount(() => {
    if (!responsive) return;
    updateCanvasSize();
    if (containerRef && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateCanvasSize());
      resizeObserver.observe(containerRef);
    }
  });

  $effect(() => {
    if (!active) {
      stopVisualization();
      return;
    }
    if (active && !isActive) {
      startVisualization();
    } else if (active && isActive && externalStream && stream !== externalStream) {
      stopVisualization();
      startVisualization();
    }
  });

  $effect(() => {
    if (!responsive) {
      resolvedWidth = width;
      resolvedHeight = height;
    }
  });
</script>

<div class="flex flex-col items-center gap-4">
  <div bind:this={containerRef} class="w-full h-full">
    <canvas 
      bind:this={canvasRef}
      width={resolvedWidth} 
      height={resolvedHeight}
      class="w-full h-full border border-gray-300 dark:border-gray-600 rounded-lg"
    ></canvas>
  </div>
  
  {#if showControls}
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
  {/if}
  
  {#if errorMessage}
    <p class="text-sm text-red-600 dark:text-red-400" role="status">
      {errorMessage}
    </p>
  {/if}
</div>
