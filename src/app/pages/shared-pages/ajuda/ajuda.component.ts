import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';
import { AuthUser } from '../../../core/models/user.model';

@Component({
  selector: 'app-ajuda',
  templateUrl: './ajuda.component.html',
  styleUrls: ['./ajuda.component.scss']
})
export class AjudaComponent implements OnInit {

  // Dados do usuário
  currentUser: AuthUser | null = null;
  hasNotifications: boolean = false;

  // Breadcrumb
  breadcrumbItems: MenuItem[] = [];
  breadcrumbHome: MenuItem = { icon: 'pi pi-home', routerLink: ['/onboarding/welcome'] };

  // Busca e filtros
  buscaTexto: string = '';
  filtroAtivo: string | null = null;
  faqsFiltrados: any[] = [];
  topicosFiltrados: any[] = [];

  // Categorias
  categorias = [
    {
      id: 'clientes',
      titulo: 'Para Clientes',
      descricao: 'Como usar a plataforma',
      icon: 'pi pi-user',
      count: 5
    },
    {
      id: 'advogados',
      titulo: 'Para Advogados',
      descricao: 'Ferramentas profissionais',
      icon: 'pi pi-briefcase',
      count: 4
    },
    {
      id: 'pagamentos',
      titulo: 'Pagamentos',
      descricao: 'Cobrança e recebimento',
      icon: 'pi pi-credit-card',
      count: 3
    },
    {
      id: 'seguranca',
      titulo: 'Segurança',
      descricao: 'Proteção de dados',
      icon: 'pi pi-shield',
      count: 2
    }
  ];

  // FAQ
  faqs = [
    {
      pergunta: 'Como criar meu primeiro processo?',
      resposta: 'Para criar seu primeiro processo, faça login em sua conta, clique em "Novo Processo" no dashboard, preencha o título e tipo do processo, descreva sua situação e clique em "Criar Processo".',
      acoes: [
        { label: 'Ver Tutorial', icon: 'pi pi-play', class: 'p-button-outlined', acao: 'tutorial' }
      ]
    },
    {
      pergunta: 'Como funciona o pagamento?',
      resposta: 'O valor é acordado com o cliente no início do processo. O pagamento é processado pela plataforma após a conclusão aprovada pelo cliente.',
      acoes: []
    },
    {
      pergunta: 'Meus dados estão seguros?',
      resposta: 'Sim! Utilizamos criptografia de ponta e todos os advogados são verificados pela OAB. Seus documentos ficam protegidos e apenas você e seu advogado têm acesso.',
      acoes: []
    },
    {
      pergunta: 'Como cancelar um processo?',
      resposta: 'Para cancelar um processo, acesse a página do processo, clique em "Configurações" e selecione "Cancelar Processo". O cancelamento deve ser aprovado pelo advogado.',
      acoes: [
        { label: 'Ver Processos', icon: 'pi pi-list', class: 'p-button-outlined', acao: 'processos' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initBreadcrumb();
    this.detectFragment();
  }

  private detectFragment(): void {
    // Detectar fragmento na URL para navegação direta
    const fragment = this.router.url.split('#')[1];
    if (fragment && ['clientes', 'advogados', 'pagamentos', 'seguranca'].includes(fragment)) {
      this.filtroAtivo = fragment;
      // Scroll para a seção
      setTimeout(() => {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }

  initBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Central de Ajuda' }
    ];
  }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
  }

  mostrarTutorial(tipo: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Tutorial',
      detail: `Tutorial "${tipo}" será implementado em breve com vídeos explicativos.`
    });
  }

  abrirChat(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Suporte',
      detail: 'Chat de suporte será implementado em breve. Use os contatos fornecidos.'
    });
  }

  mostrarTermos(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Termos de Uso',
      detail: 'Página de termos de uso será implementada em breve.'
    });
  }

  // Event handlers para o header
  onLogout(): void {
    this.authService.logout();
    this.messageService.add({
      severity: 'success',
      summary: 'Logout realizado',
      detail: 'Você foi desconectado com sucesso!'
    });
    this.router.navigate(['/onboarding/welcome']);
  }

  onNotifications(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Notificações',
      detail: 'Sistema de notificações será implementado em breve'
    });
  }

  onProfile(): void {
    this.router.navigate(['/shared/perfil']);
  }

  // Novos métodos para funcionalidades melhoradas
  filtrarConteudo(): void {
    if (this.buscaTexto.trim()) {
      this.filtroAtivo = 'busca';
      this.aplicarFiltroBusca();
    } else {
      this.filtroAtivo = null;
    }
  }

  private aplicarFiltroBusca(): void {
    const termoBusca = this.buscaTexto.toLowerCase().trim();
    
    // Filtrar FAQs
    this.faqsFiltrados = this.faqs.filter(faq => 
      faq.pergunta.toLowerCase().includes(termoBusca) ||
      faq.resposta.toLowerCase().includes(termoBusca)
    );

    // Filtrar tópicos de ajuda
    this.topicosFiltrados = this.obterTodosTopicos().filter(topico =>
      topico.titulo.toLowerCase().includes(termoBusca) ||
      topico.descricao.toLowerCase().includes(termoBusca)
    );
  }

  private obterTodosTopicos(): any[] {
    return [
      // Tópicos para clientes
      {
        titulo: 'Como criar meu primeiro processo?',
        descricao: 'Faça login em sua conta, clique em "Novo Processo" no dashboard, preencha o título e tipo do processo, descreva sua situação e clique em "Criar Processo".',
        categoria: 'clientes'
      },
      {
        titulo: 'Como conversar com meu advogado?',
        descricao: 'Após seu processo ser atribuído a um advogado, você poderá enviar mensagens diretas via chat, anexar documentos necessários e acompanhar o progresso em tempo real.',
        categoria: 'clientes'
      },
      {
        titulo: 'Meus dados estão seguros?',
        descricao: 'Sim! Utilizamos criptografia de ponta e todos os advogados são verificados pela OAB. Seus documentos ficam protegidos e apenas você e seu advogado têm acesso.',
        categoria: 'clientes'
      },
      // Tópicos para advogados
      {
        titulo: 'Como me cadastrar como advogado?',
        descricao: 'Clique em "Sou Advogado" na página inicial, preencha seus dados profissionais, envie foto do documento da OAB, aguarde verificação e comece a receber processos!',
        categoria: 'advogados'
      },
      {
        titulo: 'Como aceitar processos?',
        descricao: 'Os processos são atribuídos automaticamente pelo admin baseado em sua especialidade, disponibilidade e avaliação dos clientes.',
        categoria: 'advogados'
      },
      {
        titulo: 'Como funciona o pagamento?',
        descricao: 'O valor é acordado com o cliente no início do processo. O pagamento é processado pela plataforma após a conclusão aprovada pelo cliente.',
        categoria: 'advogados'
      },
      // Tópicos de pagamentos
      {
        titulo: 'Como funciona o pagamento?',
        descricao: 'O pagamento é processado de forma segura através da plataforma. O valor é acordado entre cliente e advogado, e a cobrança é feita após a conclusão do serviço.',
        categoria: 'pagamentos'
      },
      {
        titulo: 'Quando recebo o pagamento?',
        descricao: 'O pagamento é liberado após a aprovação do cliente sobre a conclusão do serviço. O prazo para liberação é de até 5 dias úteis.',
        categoria: 'pagamentos'
      },
      {
        titulo: 'Meus dados bancários estão seguros?',
        descricao: 'Sim! Utilizamos criptografia de ponta para proteger seus dados bancários. Não armazenamos informações sensíveis em nossos servidores.',
        categoria: 'pagamentos'
      },
      // Tópicos de segurança
      {
        titulo: 'Como meus dados são protegidos?',
        descricao: 'Utilizamos criptografia SSL/TLS de 256 bits para proteger todos os dados em trânsito. Os documentos são armazenados em servidores seguros com criptografia de ponta a ponta.',
        categoria: 'seguranca'
      },
      {
        titulo: 'Como verifico se meu advogado é confiável?',
        descricao: 'Todos os advogados são verificados pela OAB antes de serem aprovados na plataforma. Você pode verificar o número da OAB e as avaliações de outros clientes.',
        categoria: 'seguranca'
      },
      {
        titulo: 'Quem pode ver meus documentos?',
        descricao: 'Apenas você e seu advogado têm acesso aos documentos do seu processo. A plataforma não compartilha informações com terceiros sem sua autorização.',
        categoria: 'seguranca'
      }
    ];
  }

  filtrarPorCategoria(categoriaId: string): void {
    this.filtroAtivo = categoriaId;
    
    // Navegar para seções específicas baseadas na categoria
    switch (categoriaId) {
      case 'clientes':
        this.router.navigate(['/shared/ajuda'], { fragment: 'clientes' });
        break;
      case 'advogados':
        this.router.navigate(['/shared/ajuda'], { fragment: 'advogados' });
        break;
      case 'pagamentos':
        this.router.navigate(['/shared/ajuda'], { fragment: 'pagamentos' });
        break;
      case 'seguranca':
        this.router.navigate(['/shared/ajuda'], { fragment: 'seguranca' });
        break;
      default:
        this.messageService.add({
          severity: 'info',
          summary: 'Filtro Aplicado',
          detail: `Mostrando conteúdo da categoria: ${categoriaId}`
        });
    }
  }

  executarAcao(acao: string): void {
    switch (acao) {
      case 'tutorial':
        this.mostrarTutorial('criar-processo');
        break;
      case 'processos':
        this.router.navigate(['/cliente/dashboard']);
        break;
      default:
        this.messageService.add({
          severity: 'info',
          summary: 'Ação',
          detail: `Executando: ${acao}`
        });
    }
  }

  enviarEmail(): void {
    window.open('mailto:suporte@plataforma.com?subject=Suporte - Plataforma Jurídica', '_blank');
  }

  ligar(): void {
    window.open('tel:+5511999999999', '_self');
  }

  voltarAoInicio(): void {
    this.filtroAtivo = null;
    this.buscaTexto = '';
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  limparBusca(): void {
    this.buscaTexto = '';
    this.filtroAtivo = null;
    this.faqsFiltrados = [];
    this.topicosFiltrados = [];
  }

  getCategoriaLabel(categoria: string): string {
    const labels: { [key: string]: string } = {
      'clientes': 'Para Clientes',
      'advogados': 'Para Advogados',
      'pagamentos': 'Pagamentos',
      'seguranca': 'Segurança'
    };
    return labels[categoria] || categoria;
  }

  getCategoriaSeverity(categoria: string): "success" | "secondary" | "info" | "warning" | "danger" | "contrast" {
    const severities: { [key: string]: "success" | "secondary" | "info" | "warning" | "danger" | "contrast" } = {
      'clientes': 'info',
      'advogados': 'success',
      'pagamentos': 'warning',
      'seguranca': 'danger'
    };
    return severities[categoria] || 'info';
  }
}
