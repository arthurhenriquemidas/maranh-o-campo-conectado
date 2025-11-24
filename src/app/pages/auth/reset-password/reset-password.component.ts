import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [MessageService]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loading = false;
  senhaRedefinida = false;
  token: string = '';
  tokenValido = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    // Verificar se já está logado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
      return;
    }

    // Obter token da URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    
    if (!this.token) {
      this.tokenValido = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Token Inválido',
        detail: 'Link de recuperação inválido ou expirado'
      });
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.tokenValido) {
      this.loading = true;
      const newPassword = this.resetPasswordForm.get('password')?.value;

      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: (response) => {
          this.loading = false;
          this.senhaRedefinida = true;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Senha Redefinida',
            detail: response.message
          });
        },
        error: (error) => {
          this.loading = false;
          
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.message || 'Erro ao redefinir senha'
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  irParaLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  voltarParaRecuperacao(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.resetPasswordForm.controls).forEach(key => {
      const control = this.resetPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para validação
  get password() {
    return this.resetPasswordForm.get('password');
  }

  get confirmPassword() {
    return this.resetPasswordForm.get('confirmPassword');
  }

  get passwordInvalid() {
    return this.password?.invalid && this.password?.touched;
  }

  get confirmPasswordInvalid() {
    return this.confirmPassword?.invalid && this.confirmPassword?.touched;
  }

  get passwordMismatch() {
    return this.confirmPassword?.errors?.['passwordMismatch'] && this.confirmPassword?.touched;
  }
}