<script lang="ts">
  import { onMount } from 'svelte';
  import VideoCard from '$lib/components/VideoCard.svelte';
  import SearchFilters from '$lib/components/SearchFilters.svelte';
  import { settings } from '$lib/stores/settings';
  import type { YouTubeVideo } from '$lib/types';
  
  let searchQuery = $state('');
  let videos = $state<YouTubeVideo[]>([]);
  let loading = $state(false);
  let error = $state<string | null>(null);
  
  async function handleSearch() {
    if (!searchQuery.trim()) return;
    
    loading = true;
    error = null;
    
    try {
      const filter = $settings.searchFilter;

      const params = new URLSearchParams({
        q: filter === 'karaoke' ? `${searchQuery} karaoke -cover` : searchQuery,
        filter: filter, // Send filter parameter to API
        maxResults: '25'
      });
      
      const response = await fetch(`/api/youtube/search?${params}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        // If API returned an error object, use its message
        const errorMessage = data.error || response.statusText || '搜尋失敗';
        throw new Error(errorMessage);
      }
      
      videos = data.videos || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '搜尋失敗，請稍後再試';
      error = errorMessage;
      console.error('Search error:', err);
    } finally {
      loading = false;
    }
  }
  
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }
</script>

<svelte:head>
  <title>搜尋歌曲 - KaraLab</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">搜尋歌曲</h1>
  
  <!-- Search Bar -->
  <div class="card mb-6">
    <div class="flex gap-4 mb-4">
      <input
        type="text"
        bind:value={searchQuery}
        onkeypress={handleKeyPress}
        placeholder="輸入歌曲名稱或歌手..."
        class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        class="btn-primary"
        onclick={handleSearch}
        disabled={loading}
      >
        {loading ? '搜尋中...' : '搜尋'}
      </button>
    </div>
    
    <SearchFilters />
  </div>
  
  <!-- Error Message -->
  {#if error}
    <div class="card bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-6">
      <p class="text-red-700 dark:text-red-300">{error}</p>
    </div>
  {/if}
  
  <!-- Results -->
  {#if loading}
    <div class="text-center py-12">
      <div class="text-4xl mb-4">⏳</div>
      <p class="text-gray-600 dark:text-gray-400">搜尋中...</p>
    </div>
  {:else if videos.length > 0}
    <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {#each videos as video (video.id)}
        <VideoCard video={video} />
      {/each}
    </div>
  {:else if searchQuery}
    <div class="text-center py-12">
      <div class="text-4xl mb-4">🔍</div>
      <p class="text-gray-600 dark:text-gray-400">沒有找到相關結果</p>
    </div>
  {:else}
    <div class="text-center py-12">
      <div class="text-4xl mb-4">🎵</div>
      <p class="text-gray-600 dark:text-gray-400">輸入歌曲名稱開始搜尋</p>
    </div>
  {/if}
</div>
