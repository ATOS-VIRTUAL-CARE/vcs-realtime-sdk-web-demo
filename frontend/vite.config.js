import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const fs = require('fs');
const packageJson = fs.readFileSync('../package.json');
const version = JSON.parse(packageJson).version || 0;
const packageJsonSdk = fs.readFileSync('./node_modules/vcs-realtime-sdk/package.json');
const sdkVersion = JSON.parse(packageJsonSdk).version || 0;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env': {
      PACKAGE_VERSION: version,
      PACKAGE_VERSION_SDK: sdkVersion,
    }
  }
});
