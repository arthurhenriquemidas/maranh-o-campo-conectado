import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../../core/services/auth.service';
import { RegisterData } from '../../../core/models/user.model';

export interface MenuItem {
  label: string;
  action?: () => void;
  routerLink?: string;
  icon?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-seja-advogado',
  templateUrl: './seja-advogado.component.html',
  styleUrls: ['./seja-advogado.component.scss'],
  providers: [MessageService]
})
export class SejaAdvogadoComponent implements OnInit {

  menuItems: MenuItem[] = [];
  activeMenuItem: string = 'Seja um Advogado';

  // Formulários
  dadosForm!: FormGroup;
  
  // Estados
  submitting = false;
  registroCompleto = false;
  
  // Dados fixos (sempre advogado)
  tipoUsuario: 'advogado' = 'advogado';

  // FAQ state
  faqAberta: boolean[] = [];

  // Opções
  especialidadesOptions = [
    'Trabalhista',
    'Civil', 
    'Criminal',
    'Família',
    'Tributário',
    'Empresarial',
    'Previdenciário',
    'Consumidor',
    'Imobiliário',
    'Ambiental'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.initializeMenu();
    this.initializeForm();
  }

  ngOnInit() {
    this.faqAberta = new Array(6).fill(false); // 6 perguntas no FAQ
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'Sobre nós',
        action: () => this.navegarPara('/onboarding/sobre')
      },
      {
        label: 'Passo a passo',
        action: () => this.navegarPara('/onboarding/ajuda')
      },
      {
        label: 'Blog',
        action: () => this.navegarPara('/onboarding/blog')
      },
      {
        label: 'Contato',
        action: () => this.navegarPara('/onboarding/contato')
      },
      {
        label: 'Seja um Advogado',
        action: () => this.navegarPara('/onboarding/seja-advogado')
      }
    ];
  }

  private initializeForm(): void {
    // Formulário de dados para advogado
    this.dadosForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      oab: ['', Validators.required],
      especialidades: [[], Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
  }

  onMenuItemClick(item: MenuItem) {
    if (item.action) {
      item.action();
    }
  }

  onLogoClick() {
    this.router.navigate(['/']);
  }

  cadastrarAdvogado(): void {
    if (this.dadosForm.valid) {
      this.submitting = true;

      const registerData: RegisterData = {
        nome: this.dadosForm.get('nome')?.value,
        email: this.dadosForm.get('email')?.value,
        telefone: this.dadosForm.get('telefone')?.value,
        password: this.dadosForm.get('password')?.value,
        confirmPassword: this.dadosForm.get('confirmPassword')?.value,
        tipoUsuario: 'advogado',
        oab: this.dadosForm.get('oab')?.value?.toUpperCase(),
        especialidades: this.dadosForm.get('especialidades')?.value,
        // Campos de endereço vazios (não obrigatórios neste fluxo)
        cep: '',
        endereco: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: ''
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.submitting = false;
          this.registroCompleto = true;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Cadastro Realizado',
            detail: response.message || 'Sua conta foi criada com sucesso!'
          });

          // Redirecionar para login após 2 segundos
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error) => {
          this.submitting = false;
          
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no Cadastro',
            detail: error.message || 'Erro ao realizar cadastro'
          });
        }
      });
    } else {
      this.markFormTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulário Incompleto',
        detail: 'Por favor, preencha todos os campos obrigatórios'
      });
    }
  }

  private markFormTouched(): void {
    Object.keys(this.dadosForm.controls).forEach(key => {
      const control = this.dadosForm.get(key);
      control?.markAsTouched();
    });
  }

  toggleFAQ(index: number): void {
    this.faqAberta[index] = !this.faqAberta[index];
  }

  get canSubmit(): boolean {
    return this.dadosForm.valid && !this.submitting;
  }
}
