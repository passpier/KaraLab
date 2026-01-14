<script lang="ts">
  import '../app.css';
  import Navigation from '$lib/components/Navigation.svelte';
  import { settings } from '$lib/stores/settings';
  import { onMount } from 'svelte';

  // Apply dark mode on mount
  onMount(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', $settings.darkMode);
    }
    
    // Watch for dark mode changes
    return settings.subscribe(s => {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', s.darkMode);
      }
    });
  });
</script>

<div class="min-h-screen flex flex-col">
  <Navigation />

  <main class="flex-1">
    <slot />
  </main>

  <footer class="bg-gray-100 dark:bg-gray-800 py-6">
    <div class="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
      <p>&copy; 2026 KaraLab. Your Personal Karaoke Laboratory.</p>
    </div>
  </footer>
</div>
