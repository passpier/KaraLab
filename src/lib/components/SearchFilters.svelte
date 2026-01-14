<script lang="ts">
  import { settings } from '$lib/stores/settings';
  
  const filterOptions: Array<{ value: 'karaoke' | 'vocal'; label: string }> = [
    { value: 'karaoke', label: '🎤 伴奏版' },
    { value: 'vocal', label: '🎵 原唱版' }
  ];
  
  function handleFilterChange(value: 'karaoke' | 'vocal') {
    settings.update(s => ({ ...s, searchFilter: value }));
    settings.save($settings);
  }
</script>

<div class="flex gap-2 mb-4">
  {#each filterOptions as option}
    <button
      class="px-4 py-2 rounded-lg transition {$settings.searchFilter === option.value ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}"
      on:click={() => handleFilterChange(option.value)}
    >
      {option.label}
    </button>
  {/each}
</div>
