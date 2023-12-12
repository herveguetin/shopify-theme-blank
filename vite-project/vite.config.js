export default {
    build: {
      outDir: '../assets',
      assetsDir: './',
      rollupOptions: {
        // overwrite default .html entry
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