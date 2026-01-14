<script lang="ts">
  import type { AIEvaluation } from '$lib/types';
  
  interface Props {
    evaluation: AIEvaluation;
  }
  
  let { evaluation }: Props = $props();
  
  let scoreColor = $derived(evaluation.score >= 80 ? 'text-green-500' : evaluation.score >= 60 ? 'text-yellow-500' : 'text-red-500');
  let scoreBg = $derived(evaluation.score >= 80 ? 'bg-green-100 dark:bg-green-900/30' : evaluation.score >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-red-100 dark:bg-red-900/30');
</script>

<div class="card {scoreBg}">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold">AI 評分</h3>
    <div class="text-2xl font-bold {scoreColor}">
      {evaluation.score}/100
    </div>
  </div>
  
  <div class="space-y-2">
    <p class="text-gray-700 dark:text-gray-300">{evaluation.feedback}</p>
    <p class="text-xs text-gray-500 dark:text-gray-400">
      評分時間: {new Date(evaluation.evaluatedAt).toLocaleString('zh-TW')}
    </p>
  </div>
</div>
