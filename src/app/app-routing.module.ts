import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/onboarding/welcome',
    pathMatch: 'full'
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./pages/onboarding/onboarding.module').then(m => m.OnboardingModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'cliente',
    loadChildren: () => import('./pages/cliente/cliente.module').then(m => m.ClienteModule),
    canActivate: [AuthGuard],
    data: { role: 'cliente' }
  },
  {
    path: 'advogado',
    loadChildren: () => import('./pages/advogado/advogado.module').then(m => m.AdvogadoModule),
    canActivate: [AuthGuard],
    data: { role: 'advogado' }
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { role: 'admin' }
  },
  {
    path: 'shared',
    loadChildren: () => import('./pages/shared-pages/shared-pages.module').then(m => m.SharedPagesModule)
  },
  { 
    path: 'error',
    redirectTo: '/onboarding/welcome',
    pathMatch: 'prefix'
  },
  // Rota 404 - redireciona para welcome
  {
    path: '**',
    redirectTo: '/onboarding/welcome'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
