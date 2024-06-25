import { defineConfig, } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ArcoResolver, } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  base: '/front-test/',
  envDir: './viteEnv',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ArcoResolver()],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true,
        }),
      ],
    }),
    eslintPlugin({
      include: [
        'src/**/*.ts',
        'src/**/*.vue',
        'src/*.ts',
        'src/*.vue',
      ],
    }),
  ],
  resolve: {
    // 配置路径别名
    alias: {
      '@': '/src',
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
