import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.getCurrentUser();
    console.log('AuthGuard - Current user:', currentUser);
    console.log('AuthGuard - Route data:', route.data);
    
    if (currentUser) {
      // Verificar se o usuário tem permissão para acessar a rota
      const requiredRole = route.data['role'];
      
      if (requiredRole && currentUser.tipo !== requiredRole) {
        console.log('AuthGuard - Access denied, wrong role');
        this.messageService.add({
          severity: 'error',
          summary: 'Acesso Negado',
          detail: 'Você não tem permissão para acessar esta página.'
        });
        
        // Redirecionar para o dashboard correto
        this.redirectToDashboard(currentUser.tipo);
        return false;
      }
      
      console.log('AuthGuard - Access granted');
      return true;
    }

    // Usuário não logado - redirecionar para login
    console.log('AuthGuard - User not logged in, redirecting to login');
    this.messageService.add({
      severity: 'info',
      summary: 'Login Necessário',
      detail: 'Faça login para acessar esta página.'
    });
    
    this.router.navigate(['/auth/login'], { 
      queryParams: { returnUrl: state.url } 
    });
    
    return false;
  }

  private redirectToDashboard(userType: string): void {
    switch (userType) {
      case 'cliente':
        this.router.navigate(['/cliente/dashboard']);
        break;
      case 'advogado':
        this.router.navigate(['/advogado/dashboard']); // Temporário
        break;
      case 'admin':
        this.router.navigate(['/admin/processos-disponiveis']); // Temporário
        break;
      default:
        this.router.navigate(['/onboarding/welcome']);
    }
  }
}
