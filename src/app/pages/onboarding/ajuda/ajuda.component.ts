import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface MenuItem {
  label: string;
  action?: () => void;
  routerLink?: string;
  icon?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-ajuda',
  templateUrl: './ajuda.component.html',
  styleUrls: ['./ajuda.component.scss']
})
export class AjudaComponent implements OnInit {

  menuItems: MenuItem[] = [];
  activeMenuItem: string = 'Ajuda';

  // FAQ data
  faqs = [
    {
      pergunta: 'Como funciona o processo de cadastro?',
      resposta: 'O cadastro é dividido em 3 etapas: 1) Dados pessoais básicos, 2) Seleção do tipo de usuário (cliente ou advogado), 3) Confirmação e verificação. Para advogados, há uma etapa adicional de verificação da OAB.'
    },
    {
      pergunta: 'Quanto tempo demora para aprovar meu cadastro de advogado?',
      resposta: 'O processo de verificação para advogados geralmente leva até 24 horas. Nossa equipe analisa toda a documentação enviada para garantir que apenas profissionais habilitados tenham acesso à plataforma.'
    },
    {
      pergunta: 'É seguro fornecer meus dados pessoais?',
      resposta: 'Sim, utilizamos criptografia de ponta a ponta e estamos em conformidade com a LGPD. Seus dados são protegidos e utilizados exclusivamente para os serviços da plataforma.'
    },
    {
      pergunta: 'O que acontece se eu esquecer minha senha?',
      resposta: 'Você pode usar a opção "Esqueci minha senha" na página de login. Um link de redefinição será enviado para seu e-mail cadastrado, permitindo que você crie uma nova senha.'
    },
    {
      pergunta: 'Como posso alterar meus dados após o cadastro?',
      resposta: 'Após fazer login, acesse a seção "Perfil" onde você pode editar suas informações pessoais, dados de contato e preferências de privacidade.'
    },
    {
      pergunta: 'Preciso pagar algo para me cadastrar?',
      resposta: 'Não, o cadastro na plataforma 4Jus é totalmente gratuito. Você só paga pelos serviços jurídicos contratados através da plataforma, quando necessário.'
    }
  ];

  faqAberta: boolean[] = [];

  constructor(private router: Router) {
    this.initializeMenu();
    this.faqAberta = new Array(this.faqs.length).fill(false);
  }

  ngOnInit() {
    // Component initialization
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'Sobre nós',
        action: () => this.navegarPara('/onboarding/sobre')
      },
      {
        label: 'Ajuda',
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

  toggleAccordion(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.style.display = element.style.display === 'block' ? 'none' : 'block';
    }
  }

  toggleFAQ(index: number): void {
    this.faqAberta[index] = !this.faqAberta[index];
  }
}
