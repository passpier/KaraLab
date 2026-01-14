<script lang="ts">
  import { playlists } from '$lib/stores/playlists';
  import { goto } from '$app/navigation';
  import SongItem from '$lib/components/SongItem.svelte';
  import type { Playlist } from '$lib/types';
  
  let newPlaylistName = $state('');
  let selectedPlaylist = $state<Playlist | null>(null);
  
  function handleCreatePlaylist() {
    if (!newPlaylistName.trim()) return;
    playlists.add(newPlaylistName.trim());
    newPlaylistName = '';
  }
  
  function handleDeletePlaylist(id: string) {
    if (confirm('確定要刪除這個播放清單嗎？')) {
      playlists.remove(id);
      if (selectedPlaylist?.id === id) {
        selectedPlaylist = null;
      }
    }
  }
  
  function handleRemoveSong(playlistId: string, videoId: string) {
    playlists.removeSong(playlistId, videoId);
  }
</script>

<svelte:head>
  <title>播放清單 - KaraLab</title>
</svelte:head>

<div class="max-w-6xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">播放清單</h1>
  
  <div class="grid md:grid-cols-3 gap-6">
    <!-- Playlist List -->
    <div class="card">
      <h2 class="text-xl font-semibold mb-4">我的清單</h2>
      
      <!-- Create New Playlist -->
      <div class="mb-4">
        <div class="flex gap-2">
          <input
            type="text"
            bind:value={newPlaylistName}
            placeholder="新播放清單名稱"
            class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
            onkeypress={(e) => e.key === 'Enter' && handleCreatePlaylist()}
          />
          <button
            class="btn-primary"
            onclick={handleCreatePlaylist}
          >
            新增
          </button>
        </div>
      </div>
      
      <!-- Playlist Items -->
      <div class="space-y-2">
        {#each $playlists as playlist}
          <div
            class="p-3 rounded-lg cursor-pointer transition {selectedPlaylist?.id === playlist.id ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}"
            onclick={() => selectedPlaylist = playlist}
            role="button"
            tabindex="0"
            onkeydown={(e) => e.key === 'Enter' && (selectedPlaylist = playlist)}
          >
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium">{playlist.name}</div>
                <div class="text-sm opacity-75">{playlist.songs.length} 首歌曲</div>
              </div>
              <button
                type="button"
                class="text-red-500 hover:text-red-700 dark:hover:text-red-300"
                onclick={(e) => { e.stopPropagation(); handleDeletePlaylist(playlist.id); }}
              >
                ✕
              </button>
            </div>
          </div>
        {/each}
        
        {#if $playlists.length === 0}
          <div class="text-center py-8 text-gray-500 dark:text-gray-400">
            <div class="text-4xl mb-2">📋</div>
            <p>尚無播放清單</p>
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Playlist Details -->
    <div class="md:col-span-2">
      {#if selectedPlaylist}
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">{selectedPlaylist.name}</h2>
            <span class="text-sm text-gray-600 dark:text-gray-400">
              {selectedPlaylist.songs.length} 首歌曲
            </span>
          </div>
          
          {#if selectedPlaylist.songs.length > 0}
            <div class="space-y-2">
              {#each selectedPlaylist.songs as song (song.id)}
                <SongItem 
                  video={song} 
                  onRemove={(id) => selectedPlaylist && handleRemoveSong(selectedPlaylist.id, id)}
                />
              {/each}
            </div>
          {:else}
            <div class="text-center py-12 text-gray-500 dark:text-gray-400">
              <div class="text-4xl mb-2">🎵</div>
              <p>這個播放清單是空的</p>
              <p class="text-sm mt-2">從搜尋頁面將歌曲加入清單</p>
            </div>
          {/if}
        </div>
      {:else}
        <div class="card">
          <div class="text-center py-12 text-gray-500 dark:text-gray-400">
            <div class="text-4xl mb-2">📋</div>
            <p>選擇一個播放清單查看詳情</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
