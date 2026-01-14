<script lang="ts">
  import { page } from '$app/stores';
  import { queue } from '$lib/stores/queue';
  import { goto } from '$app/navigation';
  import QueueManager from './QueueManager.svelte';

  const navItems = [
    { path: '/', label: '首頁', icon: '🏠' },
    { path: '/search', label: '搜尋歌曲', icon: '🔍' },
    { path: '/recordings', label: '紀錄列表', icon: '🎙️' },
    { path: '/settings', label: '設定', icon: '⚙️' }
  ];

  let drawerOpen = $state(false);
  let currentPath = $derived($page.url.pathname);
  let queueCount = $derived($queue.length);

  function toggleDrawer() {
    drawerOpen = !drawerOpen;
  }

  function closeDrawer() {
    drawerOpen = false;
  }

  function handleNavClick(path: string) {
    closeDrawer();
    goto(path);
  }

  function handleQueuePlay() {
    // Close drawer when playing a video from queue
    closeDrawer();
  }
</script>

<nav class="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <!-- Hamburger Menu Button -->
      <button 
        class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        onclick={toggleDrawer}
        aria-label="Menu"
        aria-expanded={drawerOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <a href="/" class="text-xl font-bold text-primary flex items-center gap-2">
        <span class="text-2xl">🧪</span>
        KaraLab
      </a>

      <!-- Spacer for alignment -->
      <div class="w-10"></div>
    </div>
  </div>
</nav>

<!-- Navigation Drawer -->
{#if drawerOpen}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 bg-black/50 z-40 transition-opacity"
    onclick={closeDrawer}
    onkeydown={(e) => e.key === 'Escape' && closeDrawer()}
    role="button"
    tabindex="0"
    aria-label="Close menu"
  ></div>

  <!-- Drawer -->
  <aside 
    class="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="flex flex-col h-full">
      <!-- Drawer Header -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold text-primary flex items-center gap-2">
          <span class="text-2xl">🧪</span>
          KaraLab
        </h2>
        <button 
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          onclick={closeDrawer}
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Items -->
      <nav class="p-4 border-b border-gray-200 dark:border-gray-700">
        <ul class="space-y-2">
          {#each navItems as item}
            <li>
              <a 
                href={item.path}
                onclick={(e) => { e.preventDefault(); handleNavClick(item.path); }}
                class="flex items-center px-4 py-3 rounded-md transition relative {currentPath === item.path ? 'bg-primary text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}"
              >
                <span class="mr-3 text-xl">{item.icon}</span>
                <span class="flex-1">{item.label}</span>
              </a>
            </li>
          {/each}
        </ul>
      </nav>

      <!-- Queue Manager -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold flex items-center gap-2">
            <span>📑</span>
            播放佇列
            {#if queueCount > 0}
              <span class="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {queueCount}
              </span>
            {/if}
          </h3>
        </div>
        <QueueManager onPlay={handleQueuePlay} />
      </div>
    </div>
  </aside>
{/if}
