import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [

  // GAME PAGE (WITH SLUG)
 {
  path: 'can-i-run/:slug',
  loadComponent: () =>
    import('./pages/can-irun-game-component/can-irun-game-component')
      .then(m => m.CanIRunGameComponent)
},


  // HOME PAGE
  {
    path: '',
    component: Dashboard
  },

  // FALLBACK
  {
    path: '**',
    redirectTo: ''
  }

];
