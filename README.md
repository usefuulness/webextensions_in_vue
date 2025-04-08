# Vue.js and Tailwind CSS Web Extension

A browser extension built with Vue.js 3 and Tailwind CSS.

## Features

- Vue.js 3 with Composition API
- Tailwind CSS for styling
- Vite for fast development and building
- Manifest V3 compatibility
- Background script for extension lifecycle management
- Content script for interacting with web pages
- Popup UI with reactive components
- Options page for configuration settings

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

To start the development server:

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

### Building for Production

To build the extension for production:

```bash
npm run build
# or
yarn build
```

This will create a `dist` directory with the extension files.

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

- `public/`: Static assets and manifest.json
- `src/`: Source code
  - `pages/`: Different pages of the extension
    - `popup/`: Popup UI
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