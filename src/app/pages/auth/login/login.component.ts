import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  selectedCredential: string | null = null;
  isDesktop = false;

  // Menu items for the custom menu
  menuItems = [
    {
      label: 'Sobre nós',
      routerLink: '/onboarding/sobre',
    },
    {
      label: 'Ajuda',
      routerLink: '/onboarding/ajuda',
    },
    {
      label: 'Blog',
      routerLink: '/onboarding/blog',
    },
    {
      label: 'Contato',
      routerLink: '/onboarding/contato',
    },
    {
      label: 'Seja um Advogado',
      routerLink: '/onboarding/seja-advogado',
    }
  ];

  activeMenuItem: string = '';

  // Logo click handler
  onLogoClick(): void {
    this.router.navigate(['/onboarding/welcome']);
  }

  // Menu item click handler
  onMenuItemClick(item: any): void {
    if (item.routerLink) {
      this.router.navigate([item.routerLink]);
    }
  }

  tiposUsuario = [
    { label: 'Cliente', value: 'cliente' },
    { label: 'Advogado', value: 'advogado' },
    { label: 'Administrador', value: 'admin' }
  ];

  // Credenciais de demonstração
  demoCredentials = {
    cliente: {
      email: 'joao.silva@email.com',
      password: '123456',
      tipoUsuario: 'cliente'
    },
    advogado: {
      email: 'carlos.oliveira@adv.com',
      password: '123456',
      tipoUsuario: 'advogado'
    },
    admin: {
      email: 'admin@plataforma.com',
      password: '123456',
      tipoUsuario: 'admin'
    }
  };


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.loginForm = this.createForm();
  }

  ngOnInit(): void {
    // Se já estiver logado, redirecionar
    if (this.authService.isLoggedIn()) {
      this.redirectToDashboard();
    }

    // Detectar se é desktop
    this.checkIfDesktop();
    window.addEventListener('resize', () => this.checkIfDesktop());
  }

  createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      tipoUsuario: ['cliente', Validators.required],
      lembrarMe: [false]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (user) => {
          console.log('Login successful, user:', user);
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: `Bem-vindo, ${user.nome}!`
          });

          // Redirecionamento imediato para testar
          this.redirectToDashboard();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Erro ao fazer login';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  esqueceuSenha(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
  }

  voltarParaHome(): void {
    this.router.navigate(['/']);
  }

  fillDemoCredentials(tipoUsuario: 'cliente' | 'advogado' | 'admin'): void {
    const credentials = this.demoCredentials[tipoUsuario];

    // Definir credencial selecionada
    this.selectedCredential = tipoUsuario;

    // Preencher o formulário com as credenciais de demonstração
    this.loginForm.patchValue({
      email: credentials.email,
      password: credentials.password,
      tipoUsuario: credentials.tipoUsuario,
      lembrarMe: false
    });


    // Marcar os campos como tocados para mostrar validação
    this.loginForm.get('email')?.markAsTouched();
    this.loginForm.get('password')?.markAsTouched();
    this.loginForm.get('tipoUsuario')?.markAsTouched();

    // Limpar mensagens de erro
    this.errorMessage = '';
  }

  private redirectToDashboard(): void {
    const user = this.authService.getCurrentUser();
    console.log('Redirecting user:', user);
    if (user) {
      switch (user.tipo) {
        case 'cliente':
          console.log('Navigating to cliente dashboard');
          this.router.navigate(['/cliente/dashboard']);
          break;
        case 'advogado':
          console.log('Navigating to advogado dashboard');
          this.router.navigate(['/advogado/dashboard']);
          break;
        case 'admin':
          console.log('Navigating to admin dashboard');
          this.router.navigate(['/admin/dashboard']);
          break;
        default:
          console.log('Unknown user type, redirecting to welcome');
          this.router.navigate(['/onboarding/welcome']);
          break;
      }
    }
  }

  // Social Login Methods
  loginWithGoogle(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Simular autenticação com Google
    setTimeout(() => {
      this.isLoading = false;
      this.messageService.add({
        severity: 'info',
        summary: 'Google Login',
        detail: 'Funcionalidade de login com Google será implementada em breve'
      });
    }, 1000);
  }

  loginWithMicrosoft(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Simular autenticação com Microsoft
    setTimeout(() => {
      this.isLoading = false;
      this.messageService.add({
        severity: 'info',
        summary: 'Microsoft Login',
        detail: 'Funcionalidade de login com Microsoft será implementada em breve'
      });
    }, 1000);
  }

  loginWithApple(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Simular autenticação com Apple
    setTimeout(() => {
      this.isLoading = false;
      this.messageService.add({
        severity: 'info',
        summary: 'Apple Login',
        detail: 'Funcionalidade de login com Apple será implementada em breve'
      });
    }, 1000);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private checkIfDesktop(): void {
    this.isDesktop = window.innerWidth > 991;
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', () => this.checkIfDesktop());
  }
}
