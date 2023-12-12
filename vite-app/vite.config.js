export default {
    // output only app.js as a Shopify asset
    build: {
      outDir: '../assets',
      assetsDir: './',
      rollupOptions: {
        input: './app.js',
        output: {
            entryFileNames: 'app.js',
            chunkFileNames: 'app.js',
            assetFileNames: 'app.js'
          }
      },
      watch: true
    }
  }