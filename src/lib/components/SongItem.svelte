<script lang="ts">
  import { goto } from '$app/navigation';
  import { formatDuration, getThumbnailUrl } from '$lib/utils/youtube';
  import type { YouTubeVideo } from '$lib/types';
  
  interface Props {
    video: YouTubeVideo;
    onRemove?: (id: string) => void;
    onPlay?: (id: string) => void;
  }
  
  let { video, onRemove, onPlay }: Props = $props();

  let thumbnailUrl = $derived(getThumbnailUrl(video.id, 'default'));
  let duration = $derived(formatDuration(video.duration));
</script>

<div class="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition min-w-0">
  <img 
    src={thumbnailUrl} 
    alt={video.title}
    class="w-16 h-12 object-cover rounded flex-shrink-0"
    loading="lazy"
  />
  
  <div class="flex-1 min-w-0 overflow-hidden">
    <h4 class="font-medium truncate">{video.title}</h4>
    <p class="text-sm text-gray-600 dark:text-gray-400 truncate">{video.channelTitle}</p>
  </div>
  
  <div class="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">{duration}</div>
  
  <div class="flex gap-2 flex-shrink-0">
    <button 
      class="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition whitespace-nowrap"
      onclick={() => {
        if (onPlay) {
          onPlay(video.id);
        } else {
          goto(`/player/${video.id}`);
        }
      }}
    >
      播放
    </button>
    {#if onRemove}
      <button 
        class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition whitespace-nowrap"
        onclick={() => onRemove(video.id)}
      >
        移除
      </button>
    {/if}
  </div>
</div>
