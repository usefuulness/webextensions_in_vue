// ==============================================================
// This script helps with extension reloading during development
// ==============================================================

import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';
import { exec } from 'child_process';
import chalk from 'chalk';

// Configuration
interface ReloaderConfig {
  // Directories to watch
  watchDirs: string[];
  // Extension ID - you'll need to change this to your extension's ID once installed
  extensionId: string | null;
  // Chrome extension directory - used to find the extension ID
  chromeExtDir: string;
  // Build output directory
  distDir: string;
  // Delay before reloading (ms)
  reloadDelay: number;
}

const CONFIG: ReloaderConfig = {
  // Directories to watch
  watchDirs: ['src', 'public'],
  // Extension ID - will be auto-detected if possible
  extensionId: null,
  // Chrome extension directory - used to find the extension ID
  chromeExtDir: path.join(process.env.HOME || process.env.USERPROFILE || '', 
    process.platform === 'darwin' 
      ? '/Library/Application Support/Google/Chrome/Default/Extensions' 
      : process.platform === 'win32'
        ? '\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions'
        : '/.config/google-chrome/Default/Extensions'),
  // Build output directory
  distDir: path.join(__dirname, '../dist'),
  // Delay before reloading (ms)
  reloadDelay: 1000,
};

// Log types
type LogType = 'info' | 'warn' | 'error' | 'success';

// Log with timestamp
function log(message: string, type: LogType = 'info'): void {
  const time = new Date().toLocaleTimeString();
  const colorFn = {
    info: chalk.blue,
    warn: chalk.yellow,
    error: chalk.red,
    success: chalk.green,
  }[type];
  
  console.log(`[${time}] ${colorFn(message)}`);
}

// Try to find the extension ID
function findExtensionId(): string | null {
  try {
    // Use manifest name to help find the extension
    const manifestPath = path.join(__dirname, '../public/manifest.dev.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Check if we can find the extension in Chrome's extension directory
    const extName = manifest.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    
    if (fs.existsSync(CONFIG.chromeExtDir)) {
      const extensions = fs.readdirSync(CONFIG.chromeExtDir);
      
      for (const ext of extensions) {
        const extPath = path.join(CONFIG.chromeExtDir, ext);
        const versions = fs.readdirSync(extPath);
        
        for (const version of versions) {
          const versionPath = path.join(extPath, version);
          const versionManifestPath = path.join(versionPath, 'manifest.json');
          
          if (fs.existsSync(versionManifestPath)) {
            try {
              const extManifest = JSON.parse(fs.readFileSync(versionManifestPath, 'utf8'));
              
              if (extManifest.name && 
                  extManifest.name.toLowerCase().includes(extName.toLowerCase())) {
                log(`Found extension ID: ${ext}`, 'success');
                return ext;
              }
            } catch (e) {
              // Skip this manifest if it can't be parsed
            }
          }
        }
      }
    }
  } catch (error) {
    log(`Error finding extension ID: ${(error as Error).message}`, 'error');
  }
  
  log('Could not auto-detect extension ID. Please set it manually in the script.', 'warn');
  return null;
}

// Reload the extension in Chrome
function reloadExtension(): void {
  if (!CONFIG.extensionId) {
    CONFIG.extensionId = findExtensionId();
    
    if (!CONFIG.extensionId) {
      log('Extension ID not found. Cannot reload the extension.', 'error');
      log('Please install the extension in Chrome first and restart this script.', 'info');
      return;
    }
  }

  // Determine the right command based on the platform
  let reloadCommand: string;
  
  if (process.platform === 'darwin') {
    // macOS
    reloadCommand = `osascript -e 'tell application "Google Chrome" to reload extension "${CONFIG.extensionId}"'`;
  } else if (process.platform === 'win32') {
    // Windows - using Chrome's remote debugging protocol
    // Note: Chrome must be started with --remote-debugging-port=9222
    reloadCommand = `curl -s -X POST "http://localhost:9222/json/extensions/${CONFIG.extensionId}/reload"`;
  } else {
    // Linux and others - using Chrome's remote debugging protocol
    reloadCommand = `curl -s -X POST "http://localhost:9222/json/extensions/${CONFIG.extensionId}/reload"`;
  }

  // Execute the reload command
  exec(reloadCommand, (error, stdout, stderr) => {
    if (error) {
      log(`Failed to reload extension: ${error.message}`, 'error');
      log('Make sure Chrome is running with remote debugging enabled:', 'info');
      log('chrome --remote-debugging-port=9222', 'info');
      return;
    }
    
    log('Extension reloaded successfully!', 'success');
  });
}

// Set up file watcher
function watchFiles(): void {
  // Create watcher
  const watcher = chokidar.watch(CONFIG.watchDirs.map(dir => path.join(__dirname, '..', dir)), {
    ignored: /(^|[\/\\])\../, // Ignore dotfiles
    persistent: true,
  });

  let reloadTimeout: NodeJS.Timeout | null = null;
  const queueReload = (): void => {
    // Clear existing timeout to debounce
    if (reloadTimeout) clearTimeout(reloadTimeout);
    
    // Set new timeout
    reloadTimeout = setTimeout(() => {
      reloadExtension();
    }, CONFIG.reloadDelay);
  };

  // Watch for file changes
  watcher
    .on('change', (changedPath: string) => {
      log(`File changed: ${changedPath}`, 'info');
      queueReload();
    })
    .on('add', (changedPath: string) => {
      log(`File added: ${changedPath}`, 'info');
      queueReload();
    })
    .on('unlink', (changedPath: string) => {
      log(`File removed: ${changedPath}`, 'info');
      queueReload();
    });

  log('Watching for file changes...', 'info');
}

// Main function
function main(): void {
  log('🚀 Starting extension development server...', 'info');
  
  // Start watching files
  watchFiles();
  
  // Initial reload attempt
  setTimeout(() => {
    reloadExtension();
  }, 2000);
}

// Run the script
main();
