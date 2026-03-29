import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [

  // ✅ HOME
  {
    path: '',
    renderMode: RenderMode.Prerender
  },

  // ✅ TOOL PAGE (must match app.routes.ts)
  {
    path: 'can-i-run/:slug',
    renderMode: RenderMode.Server
  },

  // ✅ FALLBACK
  {
    path: '**',
    renderMode: RenderMode.Server
  }

];
