import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Development: `npm run dev` serves the app on http://localhost:5173
// and forwards /api requests to the backend on port 5000.
// Production: `npm run build` creates the dist/ folder, which the backend serves.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5000' }
  }
});
