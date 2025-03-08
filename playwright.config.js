const { defineConfig } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  testDir: './tests',
  use: {
    electron: {
      executablePath: path.join(__dirname, 'out', 'bce-win32-x64', 'bce.exe'),
      args: ['.'] // Arguments pour lancer votre application Electron
    },
  },
});
