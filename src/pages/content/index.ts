// Content script that runs in the context of web pages
import { PageInfo, ExtensionMessage, BackgroundResponse } from '@/types';

console.log('Content script loaded');

// Enable HMR for development
if (import.meta.hot) import.meta.hot.accept();

// Helper function to send messages to the background script
function sendMessageToBackground(message: ExtensionMessage): Promise<BackgroundResponse> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response: BackgroundResponse) => {
      resolve(response);
    });
  });
}

// Example of how to interact with the page
function analyzePage(): PageInfo {
  const pageInfo: PageInfo = {
    title: document.title,
    url: window.location.href,
    headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
      level: h.tagName.toLowerCase(),
      text: h.textContent?.trim() || ''
    })),
    links: Array.from(document.querySelectorAll('a')).length,
    images: Array.from(document.querySelectorAll('img')).length
  };
  
  return pageInfo;
}

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener((
  message: ExtensionMessage, 
  sender, 
  sendResponse: (response: BackgroundResponse) => void
) => {
  console.log('Message received in content script:', message);
  
  if (message.type === 'ANALYZE_PAGE') {
    const pageInfo = analyzePage();
    sendResponse({ success: true, data: pageInfo });
  } else {
    sendResponse({ 
      success: false, 
      error: `Unknown message type: ${message.type}` 
    });
  }
  
  return true; // Keep the messaging channel open for async responses
});
