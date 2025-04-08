<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-primary shadow-md">
      <div class="p-4">
        <h1 class="text-xl font-bold text-white">My Vue Extension</h1>
      </div>
    </header>
    
    <main class="p-4">
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-2">Welcome to your extension!</h2>
        <p class="text-gray-600">
          This is a sample popup built with Vue.js (TypeScript) and styled with Tailwind CSS.
        </p>
        
        <div class="mt-4">
          <button
            @click="incrementCount"
            class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Count is: {{ count }}
          </button>
        </div>
      </div>
      
      <div v-if="pageInfo" class="bg-white rounded-lg shadow p-4 mb-4">
        <h3 class="text-md font-semibold text-gray-800 mb-2">Current Page Info</h3>
        <p class="text-sm text-gray-700 mb-1"><span class="font-medium">Title:</span> {{ pageInfo.title }}</p>
        <p class="text-sm text-gray-700 mb-1"><span class="font-medium">Links:</span> {{ pageInfo.links }}</p>
        <p class="text-sm text-gray-700 mb-1"><span class="font-medium">Images:</span> {{ pageInfo.images }}</p>
      </div>
      
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-md font-semibold text-gray-800 mb-2">Features</h3>
        <ul class="list-disc pl-5 text-gray-600">
          <li>Vue.js 3 with Composition API</li>
          <li>TypeScript for type safety</li>
          <li>Tailwind CSS for styling</li>
          <li>Vite for fast development</li>
          <li>Manifest V3 compatible</li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { PageInfo } from '@/types';
import { analyzePage } from '@/services/ExtensionService';

export default defineComponent({
  name: 'PopupApp',
  setup() {
    // Reactive state
    const count = ref<number>(0);
    const pageInfo = ref<PageInfo | null>(null);
    
    // Methods
    const incrementCount = (): void => {
      count.value++;
    };

    // Load page info when component mounts
    onMounted(async () => {
      try {
        pageInfo.value = await analyzePage();
      } catch (error) {
        console.error('Failed to analyze page:', error);
      }
    });

    return {
      count,
      pageInfo,
      incrementCount
    };
  }
});
</script>
