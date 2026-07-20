import { defineConfig } from 'vite'
import tsconfigPath from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPath()],
	server: {
    proxy: {
      "/api": "http://localhost:4000",
    },
  },
  css: {
    modules: {
      hashPrefix: "prefix",
    },

    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})
