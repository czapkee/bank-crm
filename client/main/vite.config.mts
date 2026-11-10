import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../../', '');
  const gatewayHost = env.BANK_CRM_GATEWAY_HOST ?? 'localhost';
  const gatewayPort = env.BANK_CRM_GATEWAY_HTTP_PORT ?? '4000';

  return {
    resolve: {
      conditions: ['@org/source'],
    },
    root: import.meta.dirname,
    cacheDir: '../../node_modules/.vite/client/main',
    server: {
      port: 4200,
      host: true,
      proxy: {
        '/api': {
          target: `http://${gatewayHost}:${gatewayPort}`,
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 4300,
      host: true,
    },
    plugins: [vue(), tailwindcss()],
    build: {
      outDir: './dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  };
});
