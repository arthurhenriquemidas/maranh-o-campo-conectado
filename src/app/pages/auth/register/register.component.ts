import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../../core/services/auth.service';
import { RegisterData } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {
  
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
  submitting = false;
  
  // Dados do registro - Fixo como cliente
  tipoUsuario: 'cliente' = 'cliente';
  tipoCliente: 'PF' | 'PJ' = 'PF';
  
  // Flag para controlar exibição dos campos de endereço
  showAddressFields = false;

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
  
  // Opções - Apenas para tipo de cliente
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
    
    // Observar mudanças na senha e nos campos de informações pessoais
    this.dadosForm.get('password')?.valueChanges.subscribe(() => {
      this.checkAndShowAddressFields();
    });
    
    // Observar mudanças nos campos de informações pessoais
    this.dadosForm.get('nome')?.valueChanges.subscribe(() => {
      this.checkAndShowAddressFields();
    });
    
    this.dadosForm.get('email')?.valueChanges.subscribe(() => {
      this.checkAndShowAddressFields();
    });
    
    this.dadosForm.get('telefone')?.valueChanges.subscribe(() => {
      this.checkAndShowAddressFields();
    });
    
    this.dadosForm.get('cpf')?.valueChanges.subscribe(() => {
      this.checkAndShowAddressFields();
    });
    
    this.dadosForm.get('cnpj')?.valueChanges.subscribe(() => {
      this.checkAndShowAddressFields();
    });
    
    this.dadosForm.get('razaoSocial')?.valueChanges.subscribe(() => {
      this.checkAndShowAddressFields();
    });
    
    this.dadosForm.get('nomeResponsavel')?.valueChanges.subscribe(() => {
      this.checkAndShowAddressFields();
    });
    
  }
  
  private checkAndShowAddressFields(): void {
    const password = this.dadosForm.get('password')?.value;
    const hasPassword = password && password.length > 0;
    
    // Verificar se os campos de informações pessoais estão válidos
    const isPersonalInfoValid = this.arePersonalInfoFieldsValid();
    
    if (hasPassword && isPersonalInfoValid && !this.showAddressFields) {
      this.showAddressFields = true;
      // Adicionar validadores aos campos de endereço
      this.dadosForm.get('cep')?.setValidators([Validators.required]);
      this.dadosForm.get('endereco')?.setValidators([Validators.required]);
      this.dadosForm.get('numero')?.setValidators([Validators.required]);
      this.dadosForm.get('bairro')?.setValidators([Validators.required]);
      this.dadosForm.get('cidade')?.setValidators([Validators.required]);
      this.dadosForm.get('estado')?.setValidators([Validators.required]);
      
      // Atualizar validação
      this.dadosForm.get('cep')?.updateValueAndValidity();
      this.dadosForm.get('endereco')?.updateValueAndValidity();
      this.dadosForm.get('numero')?.updateValueAndValidity();
      this.dadosForm.get('bairro')?.updateValueAndValidity();
      this.dadosForm.get('cidade')?.updateValueAndValidity();
      this.dadosForm.get('estado')?.updateValueAndValidity();
    } else if (!hasPassword || !isPersonalInfoValid) {
      // Se não atender mais as condições, ocultar e remover validadores
      if (this.showAddressFields) {
        this.showAddressFields = false;
        this.dadosForm.get('cep')?.clearValidators();
        this.dadosForm.get('endereco')?.clearValidators();
        this.dadosForm.get('numero')?.clearValidators();
        this.dadosForm.get('bairro')?.clearValidators();
        this.dadosForm.get('cidade')?.clearValidators();
        this.dadosForm.get('estado')?.clearValidators();
        
        // Atualizar validação
        this.dadosForm.get('cep')?.updateValueAndValidity();
        this.dadosForm.get('endereco')?.updateValueAndValidity();
        this.dadosForm.get('numero')?.updateValueAndValidity();
        this.dadosForm.get('bairro')?.updateValueAndValidity();
        this.dadosForm.get('cidade')?.updateValueAndValidity();
        this.dadosForm.get('estado')?.updateValueAndValidity();
      }
    }
  }
  
  private arePersonalInfoFieldsValid(): boolean {
    const tipoCliente = this.tipoForm.get('tipoCliente')?.value;
    
    // Verificar email e telefone (sempre obrigatórios)
    const email = this.dadosForm.get('email');
    const telefone = this.dadosForm.get('telefone');
    
    // Verificar se email e telefone têm valor e são válidos
    if (!email?.value || !telefone?.value || email?.invalid || telefone?.invalid) {
      return false;
    }
    
    // Verificar campos condicionais baseados no tipo de cliente
    if (tipoCliente === 'PF') {
      const nome = this.dadosForm.get('nome');
      const cpf = this.dadosForm.get('cpf');
      // Verificar se têm valor (removendo espaços e formatação) e não são inválidos
      const nomeValid = nome?.value && String(nome.value).replace(/\s/g, '') !== '' && !nome?.invalid;
      const cpfValid = cpf?.value && String(cpf.value).replace(/[.\-\s]/g, '').length > 0 && !cpf?.invalid;
      return nomeValid && cpfValid;
    } else {
      const cnpj = this.dadosForm.get('cnpj');
      const razaoSocial = this.dadosForm.get('razaoSocial');
      const nomeResponsavel = this.dadosForm.get('nomeResponsavel');
      // Verificar se têm valor e não são inválidos
      const cnpjValid = cnpj?.value && String(cnpj.value).replace(/[.\-\/\s]/g, '').length > 0 && !cnpj?.invalid;
      const razaoSocialValid = razaoSocial?.value && String(razaoSocial.value).replace(/\s/g, '') !== '' && !razaoSocial?.invalid;
      const nomeResponsavelValid = nomeResponsavel?.value && String(nomeResponsavel.value).replace(/\s/g, '') !== '' && !nomeResponsavel?.invalid;
      return cnpjValid && razaoSocialValid && nomeResponsavelValid;
    }
  }

  private initializeForms(): void {
    // Etapa 1: Tipo de Cliente (PF ou PJ)
    this.tipoForm = this.fb.group({
      tipoCliente: ['PF', Validators.required] // Apenas seleção entre PF e PJ
    });

    // Etapa 2: Dados Pessoais
    this.dadosForm = this.fb.group({
      nome: [''], // Validação será aplicada condicionalmente
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      // Campos de endereço (sem validadores iniciais - serão adicionados quando exibidos)
      cep: [''],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],
      // Campos condicionais
      cpf: [''],
      cnpj: [''],
      razaoSocial: [''],
      nomeResponsavel: ['']
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
        label: 'Tipo de Pessoa',
        icon: 'pi pi-users'
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
    const tipoCliente = this.tipoForm.get('tipoCliente')?.value;

    // Limpar validadores anteriores
    this.dadosForm.get('nome')?.clearValidators();
    this.dadosForm.get('cpf')?.clearValidators();
    this.dadosForm.get('cnpj')?.clearValidators();
    this.dadosForm.get('razaoSocial')?.clearValidators();
    this.dadosForm.get('nomeResponsavel')?.clearValidators();

    // Aplicar validadores baseados no tipo de cliente
    if (tipoCliente === 'PF') {
      // Pessoa Física - requer nome e CPF
      this.dadosForm.get('nome')?.setValidators([Validators.required, Validators.minLength(2)]);
      this.dadosForm.get('cpf')?.setValidators([Validators.required]);
    } else {
      // Pessoa Jurídica - requer CNPJ, razão social e nome do responsável
      this.dadosForm.get('cnpj')?.setValidators([Validators.required]);
      this.dadosForm.get('razaoSocial')?.setValidators([Validators.required]);
      this.dadosForm.get('nomeResponsavel')?.setValidators([Validators.required]);
    }

    // Atualizar validação
    this.dadosForm.get('nome')?.updateValueAndValidity();
    this.dadosForm.get('cpf')?.updateValueAndValidity();
    this.dadosForm.get('cnpj')?.updateValueAndValidity();
    this.dadosForm.get('razaoSocial')?.updateValueAndValidity();
    this.dadosForm.get('nomeResponsavel')?.updateValueAndValidity();
  }

  // Finalizar Registro
  finalizarRegistro(): void {
    if (this.isAllFormsValid()) {
      this.submitting = true;

      const registerData: RegisterData = {
        email: this.dadosForm.get('email')?.value,
        telefone: this.dadosForm.get('telefone')?.value,
        password: this.dadosForm.get('password')?.value,
        confirmPassword: this.dadosForm.get('confirmPassword')?.value,
        tipoUsuario: 'cliente', // Sempre cliente
        tipo: this.tipoForm.get('tipoCliente')?.value,
        // Campos de endereço
        cep: this.dadosForm.get('cep')?.value,
        endereco: this.dadosForm.get('endereco')?.value,
        numero: this.dadosForm.get('numero')?.value,
        complemento: this.dadosForm.get('complemento')?.value,
        bairro: this.dadosForm.get('bairro')?.value,
        cidade: this.dadosForm.get('cidade')?.value,
        estado: this.dadosForm.get('estado')?.value,
        // Campos condicionais baseados em PF ou PJ
        ...(this.tipoCliente === 'PF' && {
          nome: this.dadosForm.get('nome')?.value,
          cpf: this.dadosForm.get('cpf')?.value
        }),
        ...(this.tipoCliente === 'PJ' && {
          cnpj: this.dadosForm.get('cnpj')?.value,
          razaoSocial: this.dadosForm.get('razaoSocial')?.value,
          nomeResponsavel: this.dadosForm.get('nomeResponsavel')?.value
        })
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
  onTipoClienteChange(): void {
    this.tipoCliente = this.tipoForm.get('tipoCliente')?.value;
    this.updateConditionalValidators();
    // Resetar flag de endereço quando o tipo muda
    this.showAddressFields = false;
    this.checkAndShowAddressFields();
  }

  // Navegação
  voltarLogin(): void {
    this.router.navigate(['/']);
  }

  irParaLogin(): void {
    this.router.navigate(['/auth/login']);
  }

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

  get submissionState(): string {
    return this.registroCompleto ? 'success' : '';
  }

  // Método para obter o label do estado
  getEstadoLabel(value: string): string {
    const estado = this.estadosOptions.find(estado => estado.value === value);
    return estado ? estado.label : value;
  }
}
