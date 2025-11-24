import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [MessageService]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  loading = false;
  emailEnviado = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Verificar se já está logado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      const email = this.forgotPasswordForm.get('email')?.value;

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.loading = false;
          this.emailEnviado = true;
          
          this.messageService.add({
            severity: 'success',
            summary: 'E-mail Enviado',
            detail: response.message
          });
        },
        error: (error) => {
          this.loading = false;
          
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: error.message || 'Erro ao enviar e-mail de recuperação'
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  voltarParaLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  reenviarEmail(): void {
    this.emailEnviado = false;
    this.onSubmit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      const control = this.forgotPasswordForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para validação
  get email() {
    return this.forgotPasswordForm.get('email');
  }

  get emailInvalid() {
    return this.email?.invalid && this.email?.touched;
  }
}