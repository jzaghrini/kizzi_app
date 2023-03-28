import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    root: './src',
    assetsInclude: ['**/*.svg'],
    plugins: [react()],
    appType: 'spa',
    server: {
      watch: {
        usePolling: true,
      },
      host: true,
      port: 3000,
      strictPort: true,
    },
    build: {
      outDir: '../dist',
      rollupOptions: {
        input: 'main.tsx',
        output: {
          assetFileNames: ({ name }) => {
            if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
              return 'assets/images/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },
        },
      },
    },
  })
}
