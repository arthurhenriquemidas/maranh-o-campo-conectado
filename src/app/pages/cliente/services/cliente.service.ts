import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {
  Compromisso,
  StatusOption,
  TipoOption,
  AreaDireitoOption,
  ObjetivoClienteOption,
  NivelUrgenciaOption,
  ClienteMockData
} from '../models/cliente.model';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) {}

  /**
   * Retorna os próximos compromissos do cliente
   */
  getProximosCompromissos(): Observable<Compromisso[]> {
    if (environment.useMock) {
      return this.http.get<Compromisso[]>('assets/mock/cliente/compromissos.json');
    }
    return this.http.get<Compromisso[]>('/api/cliente/compromissos');
  }

  /**
   * Retorna as opções de status para processos
   */
  getStatusOptions(): Observable<StatusOption[]> {
    if (environment.useMock) {
      return this.http.get<ClienteMockData>('assets/mock/cliente/options.json').pipe(
        map(data => data.statusOptions)
      );
    }
    return this.http.get<StatusOption[]>('/api/processos/status-options');
  }

  /**
   * Retorna as opções de tipo para processos
   */
  getTipoOptions(): Observable<TipoOption[]> {
    if (environment.useMock) {
      return this.http.get<ClienteMockData>('assets/mock/cliente/options.json').pipe(
        map(data => data.tipoOptions)
      );
    }
    return this.http.get<TipoOption[]>('/api/processos/tipo-options');
  }

  /**
   * Retorna as opções de área do direito
   */
  getAreasDireito(): Observable<AreaDireitoOption[]> {
    if (environment.useMock) {
      return this.http.get<ClienteMockData>('assets/mock/cliente/options.json').pipe(
        map(data => data.areasDireito)
      );
    }
    return this.http.get<AreaDireitoOption[]>('/api/processos/areas-direito');
  }

  /**
   * Retorna as opções de objetivo do cliente
   */
  getObjetivosCliente(): Observable<ObjetivoClienteOption[]> {
    if (environment.useMock) {
      return this.http.get<ClienteMockData>('assets/mock/cliente/options.json').pipe(
        map(data => data.objetivosCliente)
      );
    }
    return this.http.get<ObjetivoClienteOption[]>('/api/processos/objetivos-cliente');
  }

  /**
   * Retorna as opções de nível de urgência
   */
  getNiveisUrgencia(): Observable<NivelUrgenciaOption[]> {
    if (environment.useMock) {
      return this.http.get<ClienteMockData>('assets/mock/cliente/options.json').pipe(
        map(data => data.niveisUrgencia)
      );
    }
    return this.http.get<NivelUrgenciaOption[]>('/api/processos/niveis-urgencia');
  }

  /**
   * Retorna os itens do menu do header do cliente
   */
  getMenuItems(): Observable<MenuItem[]> {
    if (environment.useMock) {
      return this.http.get<ClienteMockData>('assets/mock/cliente/options.json').pipe(
        map(data => data.menuItems)
      );
    }
    return this.http.get<MenuItem[]>('/api/cliente/menu-items');
  }

  /**
   * Simula processamento de IA para análise de situação jurídica
   */
  analisarComIA(descricao: string): Observable<any> {
    if (environment.useMock) {
      return of(this.simularAnaliseIA(descricao)).pipe(delay(2000));
    }
    return this.http.post<any>('/api/ia/analisar', { descricao });
  }

  /**
   * Simula processamento de chat com IA
   */
  processarChatIA(mensagem: string): Observable<any> {
    if (environment.useMock) {
      return of(this.simularProcessamentoChat(mensagem)).pipe(delay(1500));
    }
    return this.http.post<any>('/api/ia/chat', { mensagem });
  }

  /**
   * Simula correção de texto
   */
  corrigirTexto(texto: string): Observable<string> {
    if (environment.useMock) {
      return of(this.simularCorrecaoTexto(texto)).pipe(delay(1000));
    }
    return this.http.post<string>('/api/ia/corrigir-texto', { texto });
  }

  /**
   * Simula geração de resumo da conversa
   */
  gerarResumo(mensagens: any[]): Observable<string> {
    if (environment.useMock) {
      return of(this.simularGeracaoResumo(mensagens)).pipe(delay(2000));
    }
    return this.http.post<string>('/api/ia/gerar-resumo', { mensagens });
  }

  private simularAnaliseIA(descricao: string): any {
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

  private simularProcessamentoChat(mensagem: string): any {
    const mensagemLower = mensagem.toLowerCase();

    if (mensagemLower.includes('trabalho') || mensagemLower.includes('empresa') || mensagemLower.includes('demitido')) {
      return {
        resposta: 'Entendi! Você está enfrentando uma questão trabalhista. Para te ajudar melhor, preciso de mais alguns detalhes:',
        acoes: [
          { label: 'Há quanto tempo trabalha?', icon: 'pi pi-clock', class: 'p-button-outlined' },
          { label: 'Recebeu seus direitos?', icon: 'pi pi-money-bill', class: 'p-button-outlined' },
          { label: 'Tem documentos?', icon: 'pi pi-file', class: 'p-button-outlined' }
        ]
      };
    } else if (mensagemLower.includes('produto') || mensagemLower.includes('serviço') || mensagemLower.includes('defeito')) {
      return {
        resposta: 'Vejo que é uma questão de consumo! Vamos analisar seu caso. Me conte mais sobre:',
        acoes: [
          { label: 'Que tipo de produto/serviço?', icon: 'pi pi-shopping-cart', class: 'p-button-outlined' },
          { label: 'Qual o problema?', icon: 'pi pi-exclamation-triangle', class: 'p-button-outlined' },
          { label: 'Tentou resolver?', icon: 'pi pi-comments', class: 'p-button-outlined' }
        ]
      };
    } else if (mensagemLower.includes('família') || mensagemLower.includes('divórcio') || mensagemLower.includes('pensão')) {
      return {
        resposta: 'Questão de família! Vou te ajudar com isso. Preciso entender melhor:',
        acoes: [
          { label: 'Tipo de questão?', icon: 'pi pi-heart', class: 'p-button-outlined' },
          { label: 'Há filhos envolvidos?', icon: 'pi pi-users', class: 'p-button-outlined' },
          { label: 'Situação financeira?', icon: 'pi pi-chart-line', class: 'p-button-outlined' }
        ]
      };
    } else {
      return {
        resposta: 'Interessante! Me conte mais detalhes sobre sua situação. Quanto mais informações você fornecer, melhor posso te ajudar a entender seus direitos e opções legais.'
      };
    }
  }

  private simularCorrecaoTexto(texto: string): string {
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

  private simularGeracaoResumo(mensagens: any[]): string {
    const mensagensUsuario = mensagens.filter(m => m.sender === 'user-message');
    const conteudo = mensagensUsuario.map(m => m.content).join(' ');

    return `Baseado na nossa conversa, identifiquei que você está enfrentando uma situação jurídica que requer atenção. ` +
           `Vamos analisar os detalhes fornecidos e criar um processo adequado para sua situação. ` +
           `O resumo completo será usado para preencher automaticamente os campos do formulário.`;
  }
}

