import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProcessoService } from '../../../../core/services/processo.service';
import { AuthUser } from '../../../../core/models/user.model';
import { ProcessoTipo } from '../../../../core/models/processo.model';

@Component({
  selector: 'app-novo-processo-dialog',
  templateUrl: './novo-processo-dialog.component.html',
  styleUrls: ['./novo-processo-dialog.component.scss']
})
export class NovoProcessoDialogComponent {

  @Input() visible = false;
  @Input() currentUser: AuthUser | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() processoCriado = new EventEmitter<void>();

  // Controle de tabs
  activeTabIndex = 0;

  // Estados do processo
  salvandoProcesso = false;

  // Estados da IA
  analisandoComIA = false;
  aiDescription = '';
  resultadoIA: any = null;

  // Estados do Chat
  chatLoading = false;
  chatInput = '';
  chatMessages: any[] = [];
  chatResultado: any = null;
  conversaAtiva = false;
  novoProcesso = {
    titulo: '',
    descricao: '',
    areaDireito: '',
    objetivo: '',
    valorPretendido: null as number | null,
    custosEnvolvidos: null as number | null,
    documentos: [] as File[],
    localidade: '',
    urgencia: ''
  };

  // Opções para os dropdowns
  areasDireito = [
    { label: 'Cível', value: 'civil' },
    { label: 'Trabalhista', value: 'trabalhista' },
    { label: 'Consumidor', value: 'consumidor' },
    { label: 'Criminal', value: 'criminal' },
    { label: 'Família', value: 'familia' },
    { label: 'Tributário', value: 'tributario' },
    { label: 'Administrativo', value: 'administrativo' },
    { label: 'Outro', value: 'outro' }
  ];

  objetivosCliente = [
    { label: 'Indenização', value: 'indenizacao' },
    { label: 'Contestação', value: 'contestacao' },
    { label: 'Revisão de Contrato', value: 'revisao_contrato' },
    { label: 'Cobrança', value: 'cobranca' },
    { label: 'Defesa', value: 'defesa' },
    { label: 'Ação Preventiva', value: 'acao_preventiva' },
    { label: 'Outro', value: 'outro' }
  ];

  niveisUrgencia = [
    { label: 'Baixa - Sem pressa', value: 'baixa' },
    { label: 'Média - Prazo normal', value: 'media' },
    { label: 'Alta - Urgente', value: 'alta' },
    { label: 'Crítica - Liminar ou prazo judicial próximo', value: 'critica' }
  ];

  constructor(
    private processoService: ProcessoService,
    private messageService: MessageService
  ) {}

  criarProcesso(): void {
    if (!this.novoProcesso.titulo || !this.novoProcesso.areaDireito || !this.novoProcesso.objetivo || !this.novoProcesso.urgencia) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Preencha todos os campos obrigatórios!'
      });
      return;
    }

    this.salvandoProcesso = true;

    const dadosProcesso = {
      titulo: this.novoProcesso.titulo,
      descricao: this.novoProcesso.descricao,
      tipo: this.novoProcesso.areaDireito as ProcessoTipo,
      areaDireito: this.novoProcesso.areaDireito,
      objetivo: this.novoProcesso.objetivo,
      valorPretendido: this.novoProcesso.valorPretendido || 0,
      custosEnvolvidos: this.novoProcesso.custosEnvolvidos || 0,
      localidade: this.novoProcesso.localidade,
      urgencia: this.novoProcesso.urgencia as 'baixa' | 'media' | 'alta',
      valor: this.novoProcesso.valorPretendido || 0,
      prazoEstimado: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      clienteId: this.currentUser?.id || '1'
    };

    this.processoService.createProcesso(dadosProcesso).subscribe({
      next: (processo) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso!',
          detail: 'Processo criado com sucesso! Em breve um advogado será atribuído ao seu caso.'
        });

        this.fecharDialog();
        this.processoCriado.emit();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao criar processo. Tente novamente.'
        });
        console.error('Erro ao criar processo:', error);
      },
      complete: () => {
        this.salvandoProcesso = false;
      }
    });
  }

  cancelarNovoProcesso(): void {
    this.novoProcesso = {
      titulo: '',
      descricao: '',
      areaDireito: '',
      objetivo: '',
      valorPretendido: null,
      custosEnvolvidos: null,
      documentos: [],
      localidade: '',
      urgencia: ''
    };
    this.fecharDialog();
  }

  fecharDialog(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  // Métodos para upload de documentos
  onFileSelect(event: any): void {
    const files = event.files;
    if (files && files.length > 0) {
      this.novoProcesso.documentos = [...this.novoProcesso.documentos, ...files];
    }
  }

  removerDocumento(index: number): void {
    this.novoProcesso.documentos.splice(index, 1);
  }

  // Métodos para funcionalidade da IA
  analisarComIA(): void {
    if (!this.aiDescription.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Por favor, descreva sua situação jurídica para análise.'
      });
      return;
    }

    this.analisandoComIA = true;

    // Simulação da análise da IA (substituir por integração real)
    setTimeout(() => {
      this.resultadoIA = this.simularAnaliseIA(this.aiDescription);
      this.analisandoComIA = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Análise Concluída',
        detail: 'A IA analisou sua situação e sugeriu os dados do processo.'
      });
    }, 2000);
  }

  simularAnaliseIA(descricao: string): any {
    // Simulação baseada em palavras-chave (substituir por IA real)
    const descricaoLower = descricao.toLowerCase();

    let areaDireito = 'civil';
    let objetivo = 'indenizacao';
    let urgencia = 'media';
    let valorPretendido = 0;
    let titulo = '';

    // Análise de área do direito
    if (descricaoLower.includes('trabalho') || descricaoLower.includes('empresa') || descricaoLower.includes('demitido')) {
      areaDireito = 'trabalhista';
      objetivo = 'indenizacao';
      titulo = 'Ação Trabalhista - Rescisão Indevida';
      valorPretendido = 15000;
    } else if (descricaoLower.includes('consumidor') || descricaoLower.includes('produto') || descricaoLower.includes('serviço')) {
      areaDireito = 'consumidor';
      objetivo = 'indenizacao';
      titulo = 'Ação de Consumidor';
      valorPretendido = 5000;
    } else if (descricaoLower.includes('família') || descricaoLower.includes('divórcio') || descricaoLower.includes('pensão')) {
      areaDireito = 'familia';
      objetivo = 'revisao_contrato';
      titulo = 'Ação de Família';
      valorPretendido = 8000;
    }

    // Análise de urgência
    if (descricaoLower.includes('urgente') || descricaoLower.includes('liminar') || descricaoLower.includes('prazo')) {
      urgencia = 'alta';
    } else if (descricaoLower.includes('crítico') || descricaoLower.includes('emergência')) {
      urgencia = 'critica';
    }

    return {
      titulo: titulo || 'Processo Jurídico',
      areaDireito: areaDireito,
      objetivo: objetivo,
      urgencia: urgencia,
      valorPretendido: valorPretendido,
      descricao: descricao
    };
  }

  usarSugestoesIA(): void {
    if (this.resultadoIA) {
      this.novoProcesso.titulo = this.resultadoIA.titulo;
      this.novoProcesso.areaDireito = this.resultadoIA.areaDireito;
      this.novoProcesso.objetivo = this.resultadoIA.objetivo;
      this.novoProcesso.urgencia = this.resultadoIA.urgencia;
      this.novoProcesso.valorPretendido = this.resultadoIA.valorPretendido;
      this.novoProcesso.descricao = this.resultadoIA.descricao;

      // Voltar para a aba manual para revisão
      this.activeTabIndex = 0;

      this.messageService.add({
        severity: 'success',
        summary: 'Sugestões Aplicadas',
        detail: 'Os dados foram preenchidos automaticamente. Revise e ajuste se necessário.'
      });
    }
  }

  refazerAnalise(): void {
    this.resultadoIA = null;
    this.aiDescription = '';
  }

  // Métodos para Chat Interativo
  iniciarConversa(): void {
    this.conversaAtiva = true;
    this.chatMessages = [];
    this.chatResultado = null;

    this.adicionarMensagemIA(
      'Perfeito! Vamos começar nossa conversa. Me conte sobre sua situação jurídica. ' +
      'Pode ser qualquer problema que você esteja enfrentando - trabalhista, consumidor, família, etc.'
    );
  }

  enviarMensagem(event?: any): void {
    if (event && event.type === 'keydown' && !event.shiftKey) {
      event.preventDefault();
    }

    if (!this.chatInput.trim() || this.chatLoading) return;

    // Adicionar mensagem do usuário
    this.adicionarMensagemUsuario(this.chatInput);
    const mensagem = this.chatInput;
    this.chatInput = '';

    // Simular resposta da IA
    this.chatLoading = true;
    setTimeout(() => {
      this.processarMensagemChat(mensagem);
      this.chatLoading = false;
    }, 1500);
  }

  adicionarMensagemUsuario(conteudo: string): void {
    this.chatMessages.push({
      sender: 'user-message',
      content: conteudo,
      timestamp: new Date()
    });
  }

  adicionarMensagemIA(conteudo: string, acoes?: any[]): void {
    this.chatMessages.push({
      sender: 'ai-message',
      content: conteudo,
      timestamp: new Date(),
      actions: acoes
    });
  }

  processarMensagemChat(mensagem: string): void {
    const mensagemLower = mensagem.toLowerCase();

    // Análise inteligente da mensagem
    if (mensagemLower.includes('trabalho') || mensagemLower.includes('empresa') || mensagemLower.includes('demitido')) {
      this.adicionarMensagemIA(
        'Entendi! Você está enfrentando uma questão trabalhista. Para te ajudar melhor, preciso de mais alguns detalhes:',
        [
          { label: 'Há quanto tempo trabalha?', icon: 'pi pi-clock', class: 'p-button-outlined' },
          { label: 'Recebeu seus direitos?', icon: 'pi pi-money-bill', class: 'p-button-outlined' },
          { label: 'Tem documentos?', icon: 'pi pi-file', class: 'p-button-outlined' }
        ]
      );
    } else if (mensagemLower.includes('produto') || mensagemLower.includes('serviço') || mensagemLower.includes('defeito')) {
      this.adicionarMensagemIA(
        'Vejo que é uma questão de consumo! Vamos analisar seu caso. Me conte mais sobre:',
        [
          { label: 'Que tipo de produto/serviço?', icon: 'pi pi-shopping-cart', class: 'p-button-outlined' },
          { label: 'Qual o problema?', icon: 'pi pi-exclamation-triangle', class: 'p-button-outlined' },
          { label: 'Tentou resolver?', icon: 'pi pi-comments', class: 'p-button-outlined' }
        ]
      );
    } else if (mensagemLower.includes('família') || mensagemLower.includes('divórcio') || mensagemLower.includes('pensão')) {
      this.adicionarMensagemIA(
        'Questão de família! Vou te ajudar com isso. Preciso entender melhor:',
        [
          { label: 'Tipo de questão?', icon: 'pi pi-heart', class: 'p-button-outlined' },
          { label: 'Há filhos envolvidos?', icon: 'pi pi-users', class: 'p-button-outlined' },
          { label: 'Situação financeira?', icon: 'pi pi-chart-line', class: 'p-button-outlined' }
        ]
      );
    } else {
      this.adicionarMensagemIA(
        'Interessante! Me conte mais detalhes sobre sua situação. Quanto mais informações você fornecer, melhor posso te ajudar a entender seus direitos e opções legais.'
      );
    }
  }

  executarAcao(acao: any): void {
    this.chatInput = acao.label;
    this.enviarMensagem();
  }

  corrigirTexto(): void {
    if (!this.chatInput.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Digite um texto para corrigir.'
      });
      return;
    }

    this.chatLoading = true;
    setTimeout(() => {
      const textoCorrigido = this.simularCorrecaoTexto(this.chatInput);
      this.chatInput = textoCorrigido;
      this.chatLoading = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Texto Corrigido',
        detail: 'O texto foi corrigido automaticamente!'
      });
    }, 1000);
  }

  simularCorrecaoTexto(texto: string): string {
    // Simulação de correção de texto
    return texto
      .replace(/\bvc\b/gi, 'você')
      .replace(/\btd\b/gi, 'tudo')
      .replace(/\bq\b/gi, 'que')
      .replace(/\bpq\b/gi, 'porque')
      .replace(/\bnao\b/gi, 'não')
      .replace(/\bta\b/gi, 'está')
      .replace(/\bto\b/gi, 'estou')
      .replace(/\bpro\b/gi, 'para o')
      .replace(/\bpra\b/gi, 'para')
      .replace(/\bne\b/gi, 'né')
      .replace(/\bai\b/gi, 'aí');
  }

  gerarResumo(): void {
    if (this.chatMessages.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Não há conversa para resumir.'
      });
      return;
    }

    this.chatLoading = true;
    setTimeout(() => {
      const resumo = this.simularGeracaoResumo();
      this.adicionarMensagemIA(
        `<strong>Resumo da Conversa:</strong><br><br>${resumo}`,
        [
          { label: 'Usar no Formulário', icon: 'pi pi-check', class: 'p-button-success' }
        ]
      );
      this.chatLoading = false;
    }, 2000);
  }

  simularGeracaoResumo(): string {
    const mensagensUsuario = this.chatMessages.filter(m => m.sender === 'user-message');
    const conteudo = mensagensUsuario.map(m => m.content).join(' ');

    return `Baseado na nossa conversa, identifiquei que você está enfrentando uma situação jurídica que requer atenção. ` +
           `Vamos analisar os detalhes fornecidos e criar um processo adequado para sua situação. ` +
           `O resumo completo será usado para preencher automaticamente os campos do formulário.`;
  }

  preencherFormulario(): void {
    this.chatLoading = true;
    setTimeout(() => {
      this.chatResultado = this.simularAnaliseCompleta();
      this.chatLoading = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Análise Completa',
        detail: 'Todos os dados foram extraídos da conversa!'
      });
    }, 3000);
  }

  simularAnaliseCompleta(): any {
    const mensagensUsuario = this.chatMessages.filter(m => m.sender === 'user-message');
    const conteudo = mensagensUsuario.map(m => m.content).join(' ').toLowerCase();

    let areaDireito = 'civil';
    let objetivo = 'indenizacao';
    let urgencia = 'media';
    let valorPretendido = 0;
    let titulo = '';

    if (conteudo.includes('trabalho') || conteudo.includes('empresa')) {
      areaDireito = 'trabalhista';
      objetivo = 'indenizacao';
      titulo = 'Ação Trabalhista - Rescisão Indevida';
      valorPretendido = 15000;
    } else if (conteudo.includes('produto') || conteudo.includes('consumidor')) {
      areaDireito = 'consumidor';
      objetivo = 'indenizacao';
      titulo = 'Ação de Consumidor';
      valorPretendido = 5000;
    } else if (conteudo.includes('família') || conteudo.includes('divórcio')) {
      areaDireito = 'familia';
      objetivo = 'revisao_contrato';
      titulo = 'Ação de Família';
      valorPretendido = 8000;
    }

    if (conteudo.includes('urgente') || conteudo.includes('liminar')) {
      urgencia = 'alta';
    }

    return {
      titulo: titulo || 'Processo Jurídico',
      areaDireito: areaDireito,
      objetivo: objetivo,
      urgencia: urgencia,
      valorPretendido: valorPretendido,
      resumo: this.simularGeracaoResumo()
    };
  }

  aplicarResultadoChat(): void {
    if (this.chatResultado) {
      this.novoProcesso.titulo = this.chatResultado.titulo;
      this.novoProcesso.areaDireito = this.chatResultado.areaDireito;
      this.novoProcesso.objetivo = this.chatResultado.objetivo;
      this.novoProcesso.urgencia = this.chatResultado.urgencia;
      this.novoProcesso.valorPretendido = this.chatResultado.valorPretendido;
      this.novoProcesso.descricao = this.chatResultado.resumo;

      // Voltar para a aba manual
      this.activeTabIndex = 0;

      this.messageService.add({
        severity: 'success',
        summary: 'Dados Aplicados',
        detail: 'Os dados da conversa foram aplicados ao formulário!'
      });
    }
  }

  novaConversa(): void {
    this.chatMessages = [];
    this.chatResultado = null;
    this.conversaAtiva = false;
    this.chatInput = '';
  }
}
