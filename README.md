# Vue.js, TypeScript, and Tailwind CSS Web Extension

A browser extension built with Vue.js 3, TypeScript, and Tailwind CSS.

## Features

- Vue.js 3 with Composition API
- TypeScript for type safety and better developer experience
- Tailwind CSS for styling
- Vite for fast development and building
- Manifest V3 compatibility
- Background script for extension lifecycle management
- Content script for interacting with web pages
- Popup UI with reactive components
- Options page for configuration settings
- ESLint configured for TypeScript and Vue

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies

```bash
npm install
# or
yarn install
```

### Development

#### Option 1: Basic Development Mode

To start the development server with basic file watching:

```bash
npm run dev
# or
yarn dev
```

To build the extension in watch mode:

```bash
npm run watch
# or
yarn watch
```

#### Option 2: Hot Reloading Development Mode (Recommended)

For the best development experience with hot reloading:

1. First, install the extension in Chrome:
   - Build the extension with `npm run dev:extension`
   - Load the unpacked extension from the `dist` directory into Chrome
   - Note down the extension ID (or it will be auto-detected)

2. Start Chrome with remote debugging enabled:
   ```bash
   # On Windows
   "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
   
   # On macOS
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
   
   # On Linux
   google-chrome --remote-debugging-port=9222
   ```

3. Run the development server with auto-reloading:
   ```bash
   npm run dev:chrome
   # or
   yarn dev:chrome
   ```

This will:
- Watch for file changes
- Rebuild the extension when files change
- Automatically reload the extension in Chrome


### Building for Production

To build the extension for production:

```bash
npm run build
# or
yarn build
```

This will:
1. Run TypeScript type checking
2. Build the extension for production
3. Create a `dist` directory with the extension files

### Type Checking

To run TypeScript type checking without building:

```bash
npm run type-check
# or
yarn type-check
```

### Linting

To run ESLint:

```bash
npm run lint
# or
yarn lint
```

### Installing the Extension

#### Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top right
3. Click "Load unpacked" and select the `dist` directory

#### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Select any file in the `dist` directory

## Project Structure

- `public/`: Static assets and manifest files
  - `manifest.json`: Production manifest
  - `manifest.dev.json`: Development manifest with additional permissions
- `src/`: Source code
  - `pages/`: Different pages of the extension
    - `popup/`: Popup UI
    - `options/`: Options page
    - `background/`: Background scripts
    - `content/`: Content scripts
  - `components/`: Reusable Vue components
  - `utils/`: Utility functions
  - `types.d.ts`: TypeScript type definitions
- `scripts/`: Development and build scripts
  - `extension-reloader.ts`: Hot reload helper for development

## Customization

### Tailwind CSS

You can customize the theme in `tailwind.config.js`.

### Manifest

Edit `public/manifest.json` to change extension metadata, permissions, etc.

### Adding New Features

- To add new pages, create a new directory in `src/pages/`
- To add new permissions, update them in `public/manifest.json`

## License

MITup/`: Popup UI
    - `options/`: Options page
    - `background/`: Background scripts
    - `content/`: Content scripts
  - `components/`: Reusable Vue components

## Customization

### Tailwind CSS

You can customize the theme in `tailwind.config.js`.

### Manifest

Edit `public/manifest.json` to change extension metadata, permissions, etc.

### Adding New Features

- To add new pages, create a new directory in `src/pages/`
- To add new permissions, update them in `public/manifest.json`

## License

MIT

powered by Useful-Media © 2025