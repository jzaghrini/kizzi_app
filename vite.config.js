import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import svgrPlugin from 'vite-plugin-svgr'
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    root: path.resolve(__dirname, 'src'),
    assetsInclude: ['**/*.svg'],
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    server: {
      watch: {
        usePolling: true,
      },
      host: true,
      port: 3000,
      strictPort: true,
    },
    build: {
      rollupOptions: {
        output: {
          assetFileNames: ({ name }) => {
            if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
              return 'assets/images/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },
        },
      },
      outDir: path.resolve(__dirname, 'dist'),
    },
  })
}
