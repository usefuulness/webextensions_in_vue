<template>
  <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white rounded-lg shadow">
        <div class="bg-primary text-white p-4 rounded-t-lg">
          <h1 class="text-2xl font-bold">Extension Options</h1>
        </div>
        
        <div class="p-6">
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">General Settings</h2>
            
            <div class="mb-4">
              <Toggle
                v-model="preferences.notifications"
                label="Enable notifications"
              />
            </div>
            
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Theme</label>
              <select 
                v-model="preferences.theme"
                class="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System default</option>
              </select>
            </div>
          </div>
          
          <div class="mb-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Advanced Settings</h2>
            
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Update interval (minutes)</label>
              <input 
                type="number" 
                v-model="preferences.updateInterval"
                min="1"
                max="60"
                class="block w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              >
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <div v-if="saveStatus" class="text-sm text-green-600 mr-3 self-center">
              {{ saveStatus }}
            </div>
            <button 
              @click="resetDefaults"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Reset to defaults
            </button>
            <button 
              @click="savePreferences"
              class="px-4 py-2 bg-primary border border-transparent rounded-md text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { UserPreferences } from '@/types';
import Toggle from '@/components/Toggle.vue';

export default defineComponent({
  name: 'OptionsApp',
  components: {
    Toggle
  },
  setup() {
    // Default settings
    const defaultPreferences: UserPreferences = {
      notifications: true,
      theme: 'light',
      updateInterval: 15
    };

    // Reactive state
    const preferences = ref<UserPreferences>({...defaultPreferences});
    const saveStatus = ref<string>('');

    // Load saved preferences when component mounts
    onMounted(async () => {
      try {
        const result = await new Promise<{ preferences?: UserPreferences }>(resolve => {
          chrome.storage.local.get(['preferences'], resolve);
        });
        
        if (result.preferences) {
          preferences.value = {...defaultPreferences, ...result.preferences};
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      }
    });

    // Reset preferences to defaults
    const resetDefaults = (): void => {
      preferences.value = {...defaultPreferences};
      saveStatus.value = 'Preferences reset to defaults';
    };

    // Save preferences to storage
    const savePreferences = async (): Promise<void> => {
      try {
        await new Promise<void>(resolve => {
          chrome.storage.local.set({
            preferences: preferences.value
          }, () => resolve());
        });
        
        saveStatus.value = 'Preferences saved successfully';
        
        // Clear status message after a delay
        setTimeout(() => {
          saveStatus.value = '';
        }, 2000);
      } catch (error) {
        console.error('Failed to save preferences:', error);
        saveStatus.value = 'Failed to save preferences';
      }
    };

    return {
      preferences,
      saveStatus,
      resetDefaults,
      savePreferences
    };
  }
});
</script>
