import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

export interface MenuItem {
  label: string;
  action?: () => void;
  routerLink?: string;
  icon?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.scss']
})
export class ContatoComponent implements OnInit {

  menuItems: MenuItem[] = [];
  activeMenuItem: string = 'Contato';

  contatoForm!: FormGroup;
  enviando = false;
  mensagemEnviada = false;

  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {
    this.initializeMenu();
    this.initializeForm();
  }

  ngOnInit(): void {
    // Component initialization
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

  private initializeForm() {
    this.contatoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      assunto: ['', Validators.required],
      mensagem: ['', [Validators.required, Validators.minLength(10)]],
      privacidade: [false, Validators.requiredTrue]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contatoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  enviarMensagem() {
    if (this.contatoForm.valid) {
      this.enviando = true;

      // Simular envio da mensagem
      setTimeout(() => {
        console.log('Mensagem enviada:', this.contatoForm.value);
        this.mensagemEnviada = true;
        this.enviando = false;

        // Reset após 5 segundos
        setTimeout(() => {
          this.mensagemEnviada = false;
        }, 5000);
      }, 2000);
    } else {
      // Marcar todos os campos como tocados para mostrar validações
      Object.keys(this.contatoForm.controls).forEach(key => {
        this.contatoForm.get(key)?.markAsTouched();
      });
    }
  }

  limparFormulario() {
    this.contatoForm.reset();
    this.mensagemEnviada = false;
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
}

