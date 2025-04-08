// Background script for the extension
import { UserPreferences, ExtensionData, ExtensionMessage, BackgroundResponse } from '@/types';

console.log('Background script loaded');

// Add this line to enable HMR for background script
if (import.meta.hot) import.meta.hot.accept();

// Default preferences
const defaultPreferences: UserPreferences = {
  theme: 'light',
  notifications: true,
  updateInterval: 15
};

// Default data
const defaultData: ExtensionData = {
  lastUsed: new Date().toISOString()
};

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');
    
    // Initialize storage with default values
    chrome.storage.local.set({
      preferences: defaultPreferences,
      data: defaultData
    }, () => {
      console.log('Default settings initialized');
    });
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((
  message: ExtensionMessage, 
  sender, 
  sendResponse: (response: BackgroundResponse) => void
) => {
  console.log('Message received in background script:', message);
  
  if (message.type === 'GET_DATA') {
    // Example of fetching data from storage and responding
    chrome.storage.local.get(['data'], (result) => {
      sendResponse({ 
        success: true, 
        data: result.data as ExtensionData 
      });
    });
    return true; // Required to use sendResponse asynchronously
  }
  
  if (message.type === 'UPDATE_DATA') {
    // Example of updating data in storage
    chrome.storage.local.set({
      data: {
        ...message.data,
        lastUpdated: new Date().toISOString()
      } as ExtensionData
    }, () => {
      sendResponse({ success: true });
    });
    return true; // Required to use sendResponse asynchronously
  }
  
  // Default response for unknown message types
  sendResponse({ 
    success: false, 
    error: `Unknown message type: ${message.type}` 
  });
  return false;
});
