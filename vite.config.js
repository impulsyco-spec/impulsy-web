import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        soluciones: resolve(__dirname, 'soluciones.html'),
        automatizaciones: resolve(__dirname, 'automatizaciones.html'),
        testimonios: resolve(__dirname, 'testimonios.html'),
        contacto: resolve(__dirname, 'contacto.html'),
      },
    },
  },
});
