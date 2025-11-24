import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../../core/services/auth.service';
import { RegisterData } from '../../../core/models/user.model';

@Component({
  selector: 'app-register-wizard',
  templateUrl: './register-wizard.component.html',
  styleUrls: ['./register-wizard.component.scss'],
  providers: [MessageService]
})
export class RegisterWizardComponent implements OnInit {
  
  // Controle do Wizard
  currentStep = 0;
  steps: MenuItem[] = [];
  
  // Formulários por etapa
  tipoForm!: FormGroup;
  dadosForm!: FormGroup;
  confirmacaoForm!: FormGroup;
  
  // Estados
  loading = false;
  registroCompleto = false;
  
  // Dados do registro
  tipoUsuario: 'cliente' | 'advogado' = 'cliente';
  tipoCliente: 'PF' | 'PJ' = 'PF';
  
  // Opções
  tiposUsuarioOptions = [
    { 
      label: 'Cliente', 
      value: 'cliente', 
      icon: 'pi pi-user',
      description: 'Preciso de serviços jurídicos'
    },
    { 
      label: 'Advogado', 
      value: 'advogado', 
      icon: 'pi pi-balance-scale',
      description: 'Sou profissional do direito'
    }
  ];
  
  tipoClienteOptions = [
    { 
      label: 'Pessoa Física', 
      value: 'PF', 
      icon: 'pi pi-user',
      description: 'Sou uma pessoa física'
    },
    { 
      label: 'Pessoa Jurídica', 
      value: 'PJ', 
      icon: 'pi pi-building',
      description: 'Represento uma empresa'
    }
  ];

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

  estadosOptions = [
    { label: 'Acre', value: 'AC' },
    { label: 'Alagoas', value: 'AL' },
    { label: 'Amapá', value: 'AP' },
    { label: 'Amazonas', value: 'AM' },
    { label: 'Bahia', value: 'BA' },
    { label: 'Ceará', value: 'CE' },
    { label: 'Distrito Federal', value: 'DF' },
    { label: 'Espírito Santo', value: 'ES' },
    { label: 'Goiás', value: 'GO' },
    { label: 'Maranhão', value: 'MA' },
    { label: 'Mato Grosso', value: 'MT' },
    { label: 'Mato Grosso do Sul', value: 'MS' },
    { label: 'Minas Gerais', value: 'MG' },
    { label: 'Pará', value: 'PA' },
    { label: 'Paraíba', value: 'PB' },
    { label: 'Paraná', value: 'PR' },
    { label: 'Pernambuco', value: 'PE' },
    { label: 'Piauí', value: 'PI' },
    { label: 'Rio de Janeiro', value: 'RJ' },
    { label: 'Rio Grande do Norte', value: 'RN' },
    { label: 'Rio Grande do Sul', value: 'RS' },
    { label: 'Rondônia', value: 'RO' },
    { label: 'Roraima', value: 'RR' },
    { label: 'Santa Catarina', value: 'SC' },
    { label: 'São Paulo', value: 'SP' },
    { label: 'Sergipe', value: 'SE' },
    { label: 'Tocantins', value: 'TO' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.initializeForms();
    this.initializeSteps();
  }

  ngOnInit(): void {
    // Verificar se já está logado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  private initializeForms(): void {
    // Etapa 1: Tipo de Usuário
    this.tipoForm = this.fb.group({
      tipoUsuario: ['cliente', Validators.required],
      tipoCliente: ['PF'] // Apenas para clientes
    });

    // Etapa 2: Dados Pessoais
    this.dadosForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      // Campos de endereço
      cep: ['', Validators.required],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      // Campos condicionais
      cpf: [''],
      cnpj: [''],
      razaoSocial: [''],
      nomeResponsavel: [''],
      oab: [''],
      especialidades: [[]]
    }, {
      validators: this.passwordMatchValidator
    });

    // Etapa 3: Confirmação
    this.confirmacaoForm = this.fb.group({
      termos: [false, Validators.requiredTrue],
      newsletter: [true]
    });
  }

  private initializeSteps(): void {
    this.steps = [
      {
        label: 'Tipo de Conta',
        icon: 'pi pi-user-plus'
      },
      {
        label: 'Dados Pessoais',
        icon: 'pi pi-id-card'
      },
      {
        label: 'Confirmação',
        icon: 'pi pi-check'
      }
    ];
  }

  // Navegação do Wizard
  nextStep(): void {
    if (this.isCurrentStepValid()) {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        this.updateConditionalValidators();
      }
    } else {
      this.markCurrentStepTouched();
    }
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    // Permitir apenas se as etapas anteriores estão válidas
    if (this.canGoToStep(step)) {
      this.currentStep = step;
      this.updateConditionalValidators();
    }
  }

  private canGoToStep(step: number): boolean {
    for (let i = 0; i < step; i++) {
      if (!this.isStepValid(i)) {
        return false;
      }
    }
    return true;
  }

  private isStepValid(step: number): boolean {
    switch (step) {
      case 0: return this.tipoForm.valid;
      case 1: return this.dadosForm.valid;
      case 2: return this.confirmacaoForm.valid;
      default: return false;
    }
  }

  private isCurrentStepValid(): boolean {
    return this.isStepValid(this.currentStep);
  }

  private markCurrentStepTouched(): void {
    let form: FormGroup;
    
    switch (this.currentStep) {
      case 0: form = this.tipoForm; break;
      case 1: form = this.dadosForm; break;
      case 2: form = this.confirmacaoForm; break;
      default: return;
    }

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
    });
  }

  private updateConditionalValidators(): void {
    const tipoUsuario = this.tipoForm.get('tipoUsuario')?.value;
    const tipoCliente = this.tipoForm.get('tipoCliente')?.value;

    // Limpar validadores anteriores
    this.dadosForm.get('cpf')?.clearValidators();
    this.dadosForm.get('cnpj')?.clearValidators();
    this.dadosForm.get('razaoSocial')?.clearValidators();
    this.dadosForm.get('nomeResponsavel')?.clearValidators();
    this.dadosForm.get('oab')?.clearValidators();
    this.dadosForm.get('especialidades')?.clearValidators();

    // Aplicar validadores baseados no tipo
    if (tipoUsuario === 'cliente') {
      if (tipoCliente === 'PF') {
        this.dadosForm.get('cpf')?.setValidators([Validators.required]);
      } else {
        this.dadosForm.get('cnpj')?.setValidators([Validators.required]);
        this.dadosForm.get('razaoSocial')?.setValidators([Validators.required]);
        this.dadosForm.get('nomeResponsavel')?.setValidators([Validators.required]);
      }
    } else if (tipoUsuario === 'advogado') {
      this.dadosForm.get('oab')?.setValidators([Validators.required]);
      this.dadosForm.get('especialidades')?.setValidators([Validators.required]);
    }

    // Atualizar validação
    this.dadosForm.get('cpf')?.updateValueAndValidity();
    this.dadosForm.get('cnpj')?.updateValueAndValidity();
    this.dadosForm.get('razaoSocial')?.updateValueAndValidity();
    this.dadosForm.get('nomeResponsavel')?.updateValueAndValidity();
    this.dadosForm.get('oab')?.updateValueAndValidity();
    this.dadosForm.get('especialidades')?.updateValueAndValidity();
  }

  // Finalizar Registro
  finalizarRegistro(): void {
    if (this.isAllFormsValid()) {
      this.loading = true;

      const registerData: RegisterData = {
        nome: this.dadosForm.get('nome')?.value,
        email: this.dadosForm.get('email')?.value,
        telefone: this.dadosForm.get('telefone')?.value,
        password: this.dadosForm.get('password')?.value,
        confirmPassword: this.dadosForm.get('confirmPassword')?.value,
        tipoUsuario: this.tipoForm.get('tipoUsuario')?.value,
        // Campos de endereço
        cep: this.dadosForm.get('cep')?.value,
        endereco: this.dadosForm.get('endereco')?.value,
        numero: this.dadosForm.get('numero')?.value,
        complemento: this.dadosForm.get('complemento')?.value,
        bairro: this.dadosForm.get('bairro')?.value,
        cidade: this.dadosForm.get('cidade')?.value,
        estado: this.dadosForm.get('estado')?.value,
        // Campos condicionais
        ...(this.tipoUsuario === 'cliente' && {
          tipo: this.tipoForm.get('tipoCliente')?.value,
          cpf: this.tipoCliente === 'PF' ? this.dadosForm.get('cpf')?.value : undefined,
          cnpj: this.tipoCliente === 'PJ' ? this.dadosForm.get('cnpj')?.value : undefined,
          razaoSocial: this.tipoCliente === 'PJ' ? this.dadosForm.get('razaoSocial')?.value : undefined,
          nomeResponsavel: this.tipoCliente === 'PJ' ? this.dadosForm.get('nomeResponsavel')?.value : undefined
        }),
        ...(this.tipoUsuario === 'advogado' && {
          oab: this.dadosForm.get('oab')?.value,
          especialidades: this.dadosForm.get('especialidades')?.value
        })
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.loading = false;
          this.registroCompleto = true;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Cadastro Realizado',
            detail: response.message
          });
        },
        error: (error) => {
          this.loading = false;
          
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no Cadastro',
            detail: error.message || 'Erro ao realizar cadastro'
          });
        }
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulário Incompleto',
        detail: 'Verifique todos os campos obrigatórios'
      });
    }
  }

  private isAllFormsValid(): boolean {
    return this.tipoForm.valid && this.dadosForm.valid && this.confirmacaoForm.valid;
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

  // Handlers de mudança
  onTipoUsuarioChange(): void {
    this.tipoUsuario = this.tipoForm.get('tipoUsuario')?.value;
    this.updateConditionalValidators();
  }

  onTipoClienteChange(): void {
    this.tipoCliente = this.tipoForm.get('tipoCliente')?.value;
    this.updateConditionalValidators();
  }

  // Navegação
  irParaLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  // Getters para validação
  get currentForm(): FormGroup {
    switch (this.currentStep) {
      case 0: return this.tipoForm;
      case 1: return this.dadosForm;
      case 2: return this.confirmacaoForm;
      default: return this.tipoForm;
    }
  }

  get canProceed(): boolean {
    return this.isCurrentStepValid();
  }

  get isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }

  // Método para obter o label do estado
  getEstadoLabel(value: string): string {
    const estado = this.estadosOptions.find(estado => estado.value === value);
    return estado ? estado.label : value;
  }
}