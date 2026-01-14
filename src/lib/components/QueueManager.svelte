<script lang="ts">
  import { queue } from '$lib/stores/queue';
  import { goto } from '$app/navigation';
  import SongItem from './SongItem.svelte';
  import type { QueueItem } from '$lib/types';
  
  interface Props {
    onPlay?: () => void;
  }
  
  let { onPlay }: Props = $props();
  
  let draggedItem = $state<QueueItem | null>(null);
  let draggedIndex = $state<number>(-1);
  let dragOverIndex = $state<number>(-1);
  
  function handleRemove(id: string) {
    queue.remove(id);
  }
  
  function handlePlay(id: string) {
    // Remove video from queue when starting to play
    const queueItem = $queue.find(item => item.video.id === id);
    if (queueItem) {
      queue.remove(queueItem.id);
    }
    goto(`/player/${id}`);
    // Call the callback to close drawer if provided
    if (onPlay) {
      onPlay();
    }
  }
  
  function handleMoveUp(id: string) {
    queue.moveUp(id);
  }
  
  function handleMoveDown(id: string) {
    queue.moveDown(id);
  }
  
  function handleClear() {
    if (confirm('確定要清空播放佇列嗎？')) {
      queue.clear();
    }
  }
  
  function handleDragStart(event: DragEvent, item: QueueItem, index: number) {
    if (!event.dataTransfer) return;
    draggedItem = item;
    draggedIndex = index;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', item.id);
    // Add visual feedback
    if (event.target instanceof HTMLElement) {
      event.target.style.opacity = '0.5';
    }
  }
  
  function handleDragEnd(event: DragEvent) {
    draggedItem = null;
    draggedIndex = -1;
    dragOverIndex = -1;
    // Reset visual feedback
    if (event.target instanceof HTMLElement) {
      event.target.style.opacity = '1';
    }
  }
  
  function handleDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    if (draggedIndex !== index) {
      dragOverIndex = index;
    }
  }
  
  function handleDragLeave() {
    dragOverIndex = -1;
  }
  
  function handleDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();
    if (draggedIndex === -1 || draggedIndex === dropIndex) {
      dragOverIndex = -1;
      return;
    }
    queue.reorder(draggedIndex, dropIndex);
    draggedItem = null;
    draggedIndex = -1;
    dragOverIndex = -1;
  }
</script>

<div>
  <div class="flex items-center justify-between mb-4">
    {#if $queue.length > 0}
      <button 
        class="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        onclick={handleClear}
      >
        清空
      </button>
    {/if}
  </div>
  
  {#if $queue.length === 0}
    <div class="text-center py-8 text-gray-500 dark:text-gray-400">
      <div class="text-3xl mb-3">📑</div>
      <p class="text-sm">播放佇列是空的</p>
      <p class="text-xs mt-1">從搜尋頁面將歌曲加入佇列</p>
    </div>
  {:else}
    <div class="space-y-2">
      {#each $queue as item, index (item.id)}
        <div 
          class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all cursor-move {dragOverIndex === index ? 'ring-2 ring-primary bg-primary/10 dark:bg-primary/20' : ''} {draggedIndex === index ? 'opacity-50' : ''}"
          draggable="true"
          role="button"
          tabindex="0"
          aria-label="拖曳以重新排序"
          ondragstart={(e) => handleDragStart(e, item, index)}
          ondragend={handleDragEnd}
          ondragover={(e) => handleDragOver(e, index)}
          ondragleave={handleDragLeave}
          ondrop={(e) => handleDrop(e, index)}
        >
          <div class="flex-1 min-w-0 overflow-hidden">
            <SongItem video={item.video} onRemove={handleRemove} onPlay={handlePlay} />
          </div>
          
          <div class="text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing text-xs">
            ⋮⋮
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
