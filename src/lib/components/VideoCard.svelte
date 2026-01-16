<script lang="ts">
  import { goto } from '$app/navigation';
  import { queue } from '$lib/stores/queue';
  import { playlists } from '$lib/stores/playlists';
  import { formatDuration, getThumbnailUrl } from '$lib/utils/youtube';
  import type { YouTubeVideo } from '$lib/types';
  
  interface Props {
    video: YouTubeVideo;
  }
  
  let { video }: Props = $props();
  
  let showPlaylistMenu = $state(false);
  
  let thumbnailUrl = $derived(getThumbnailUrl(video.id, 'medium'));
  let duration = $derived(formatDuration(video.duration));
  
  function handlePlay() {
    // Convert Proxy to plain object for page state (history.pushState can't clone Proxies)
    const plainVideo = JSON.parse(JSON.stringify(video));
    goto(`/player/${video.id}`, { 
      state: { video: plainVideo } 
    });
  }
  
  function handleAddToQueue() {
    queue.add(video);
  }
  
  function handleAddToPlaylist(playlistId: string) {
    playlists.addSong(playlistId, video);
    showPlaylistMenu = false;
  }
</script>

<div class="card hover:shadow-lg transition-shadow">
  <div class="relative mb-4">
    <img 
      src={thumbnailUrl} 
      alt={video.title}
      class="w-full aspect-video object-cover rounded-lg"
      loading="lazy"
    />
    <div class="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
      {duration}
    </div>
    {#if video.videoType}
      <div class="absolute top-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded">
        {video.videoType === 'karaoke' ? '🎤 伴奏' : '🎵 原唱'}
      </div>
    {/if}
  </div>
  
  <h3 class="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">{video.channelTitle}</p>
  
  <div class="flex gap-2">
    <button 
      class="btn-primary flex-1"
      onclick={handlePlay}
    >
      播放
    </button>
    <button 
      class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      onclick={handleAddToQueue}
    >
      加入佇列
    </button>
  </div>
</div>
