<script lang="ts">
  import { recordings } from '$lib/stores/recordings';
  import { evaluateRecording } from '$lib/utils/gemini';
  import AIScoreCard from '$lib/components/AIScoreCard.svelte';
  import { format } from 'date-fns';
  import { zhTW } from 'date-fns/locale';
  
  let evaluatingId = $state<string | null>(null);
  
  async function handleEvaluate(recordingId: string) {
    const recording = $recordings.find(r => r.id === recordingId);
    if (!recording || !recording.audioBlob) return;
    
    evaluatingId = recordingId;
    
    try {
      const evaluation = await evaluateRecording(recording.audioBlob, recording.songName);
      recordings.updateEvaluation(recordingId, {
        ...evaluation,
        evaluatedAt: new Date()
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '評分失敗';
      alert('評分失敗：' + errorMessage);
    } finally {
      evaluatingId = null;
    }
  }
  
  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
</script>

<svelte:head>
  <title>紀錄列表 - KaraLab</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">紀錄列表</h1>
  
  <!-- Recordings List -->
  <div class="space-y-4">
    {#if $recordings.length === 0}
      <div class="card text-center py-12">
        <div class="text-4xl mb-4">🎙️</div>
        <p class="text-gray-600 dark:text-gray-400">尚無紀錄</p>
      </div>
    {:else}
      {#each $recordings as recording (recording.id)}
        <div class="card">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold mb-2">{recording.songName}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {format(recording.date, 'yyyy年MM月dd日 HH:mm', { locale: zhTW })} · 
                長度: {formatDuration(recording.duration)}
              </p>
            </div>
            <button
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              onclick={() => recordings.remove(recording.id)}
            >
              刪除
            </button>
          </div>
          
          <!-- Audio Player -->
          {#if recording.url}
            <audio controls class="w-full mb-4">
              <source src={recording.url} type="audio/webm" />
              您的瀏覽器不支援音訊播放
            </audio>
          {/if}
          
          <!-- AI Evaluation -->
          {#if recording.aiEvaluation}
            <AIScoreCard evaluation={recording.aiEvaluation} />
          {:else}
            <button
              class="btn-primary"
              onclick={() => handleEvaluate(recording.id)}
              disabled={evaluatingId === recording.id}
            >
              {evaluatingId === recording.id ? '評分中...' : 'AI 評分'}
            </button>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>
