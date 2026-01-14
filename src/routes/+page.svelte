<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<svelte:head>
  <title>KaraLab - 你的專屬K歌實驗室</title>
  <meta name="description" content="AI驅動的卡拉OK練習平台。搜尋YouTube歌曲，即時練唱，AI評分回饋。" />
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8 text-center">
  <!-- Hero Section -->
  <section class="py-20">
    <div class="text-6xl mb-6">🧪</div>
    <h1 class="text-5xl font-bold mb-4">
      KaraLab
    </h1>
    <p class="text-2xl text-gray-600 dark:text-gray-400 mb-2">
      你的專屬K歌實驗室
    </p>
    <p class="text-lg text-gray-500 dark:text-gray-500 mb-8">
      AI驅動的卡拉OK練習平台
    </p>
    <button 
      class="btn-primary text-lg px-8 py-3"
      onclick={() => goto('/search')}
    >
      開始練唱 🎤
    </button>
  </section>

  <!-- Features -->
  <section class="grid md:grid-cols-4 gap-6 py-12">
    <div class="card">
      <div class="text-4xl mb-4">🔍</div>
      <h3 class="text-xl font-semibold mb-2">智能搜尋</h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm">
        伴奏版/人聲版分類，精準找到想唱的歌
      </p>
    </div>

    <div class="card">
      <div class="text-4xl mb-4">📑</div>
      <h3 class="text-xl font-semibold mb-2">播放佇列</h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm">
        預先排歌，自動連播，K歌不中斷
      </p>
    </div>

    <div class="card">
      <div class="text-4xl mb-4">🎤</div>
      <h3 class="text-xl font-semibold mb-2">即時練習</h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm">
        麥克風視覺化，調整速度，反覆練習
      </p>
    </div>

    <div class="card">
      <div class="text-4xl mb-4">🤖</div>
      <h3 class="text-xl font-semibold mb-2">AI評分</h3>
      <p class="text-gray-600 dark:text-gray-400 text-sm">
        錄音上傳AI分析，獲得專業回饋
      </p>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-12 card bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
    <h2 class="text-2xl font-bold mb-4">準備好開始你的歌唱實驗了嗎？</h2>
    <p class="text-gray-600 dark:text-gray-400 mb-6">
      完全免費，無需註冊，立即開始練唱
    </p>
    <!--
    <div class="flex gap-4 justify-center">
      <button 
        class="btn-primary px-6 py-3"
        onclick={() => goto('/search')}
      >
        搜尋歌曲
      </button>
      <button 
        class="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        onclick={() => goto('/practice')}
      >
        直接練習
      </button>
    </div>
    -->
  </section>
</div>
