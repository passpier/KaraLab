<script lang="ts">
  import { toast } from '$lib/stores/toast.svelte';
  import { fly } from 'svelte/transition';
</script>

<div class="fixed bottom-4 left-4 z-50 space-y-2">
  {#each toast.toasts as item (item.id)}
    <div 
      transition:fly={{ y: -20, duration: 300 }}
      class="px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]"
      class:bg-green-500={item.type === 'success'}
      class:bg-red-500={item.type === 'error'}
      class:bg-blue-500={item.type === 'info'}
    >
      <span class="text-white flex-1">{item.message}</span>
      <button 
        onclick={() => toast.dismiss(item.id)}
        class="text-white hover:text-gray-200"
      >
        ✕
      </button>
    </div>
  {/each}
</div>
