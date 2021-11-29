import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { RootComponent } from './root.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '**',
    component: RootComponent,
    pathMatch: 'full'
  },
];

export const routing: ModuleWithProviders<AppComponent> = RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
  // useHash: true
});
