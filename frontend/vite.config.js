
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'

const isDesktop = process.env.APP_MODE !== 'web'

export default defineConfig({
    base: './',
    plugins: [
        react(),
        ...(isDesktop
            ? [
                electron({
                    main: {
                        entry: 'electron/main.js',
                    },
                }),
            ]
            : []),
    ],
    server: {
        port: 5173,
        strictPort: false,
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
})
