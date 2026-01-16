<script lang="ts">
  import { settings } from '$lib/stores/settings';
  
  function handleDarkModeToggle() {
    settings.update(s => ({ ...s, darkMode: !s.darkMode }));
    settings.save($settings);
  }
  
  function handleVolumeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const volume = parseInt(target.value, 10);
    settings.update(s => ({ ...s, defaultVolume: volume }));
    settings.save($settings);
  }
  
  function handleAutoplayToggle() {
    settings.update(s => ({ ...s, autoplay: !s.autoplay }));
    settings.save($settings);
  }
  
  function handleSearchFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const filter = target.value as 'karaoke' | 'vocal';
    settings.update(s => ({ ...s, searchFilter: filter }));
    settings.save($settings);
  }
  
  function handleRecordingToggle() {
    settings.update(s => ({ ...s, recordingEnabled: !s.recordingEnabled }));
    settings.save($settings);
  }
</script>

<svelte:head>
  <title>設定 - KaraLab</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6">設定</h1>
  
  <div class="card space-y-6">
    <!-- Dark Mode -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-semibold mb-1">深色模式</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">切換深色/淺色主題</p>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={$settings.darkMode}
          onchange={handleDarkModeToggle}
          class="sr-only peer"
        />
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
      </label>
    </div>
    
    <!-- Default Volume -->
    <div>
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-semibold">預設音量</h3>
        <span class="text-sm text-gray-600 dark:text-gray-400">{$settings.defaultVolume}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={$settings.defaultVolume}
        oninput={handleVolumeChange}
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </div>
    
    <!-- Autoplay -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-semibold mb-1">自動播放下一首</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">播放佇列中的歌曲結束後自動播放下一首</p>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={$settings.autoplay}
          onchange={handleAutoplayToggle}
          class="sr-only peer"
        />
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
      </label>
    </div>
    
    <!-- Search Filter -->
    <div>
      <h3 class="font-semibold mb-2">預設搜尋篩選</h3>
      <select
        value={$settings.searchFilter}
        onchange={handleSearchFilterChange}
        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        >
        <option value="karaoke">🎤 伴奏版</option>
        <option value="vocal">🎵 原唱版</option>
      </select>
    </div>
    
    <!-- Recording Enabled -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="font-semibold mb-1">啟用錄音</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">播放影片時自動錄音（需麥克風權限）</p>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={$settings.recordingEnabled}
          onchange={handleRecordingToggle}
          class="sr-only peer"
        />
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
      </label>
    </div>
  </div>
</div>
