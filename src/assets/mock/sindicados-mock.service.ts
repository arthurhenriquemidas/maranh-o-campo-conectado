import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Sindicado, DocumentoComprobatorio } from '../../app/core/models/user.model';
import { SindicadoFiltro, SindicadoEstatisticas } from '../../app/core/services/sindicado.service';

// Importar dados de teste
import { sindicadosData } from './sindicados-data';

@Injectable({
  providedIn: 'root'
})
export class SindicadosMockService {

  constructor() { }

  // Simular busca de sindicados com filtros
  buscarSindicados(filtros?: SindicadoFiltro): Observable<Sindicado[]> {
    let sindicados = [...sindicadosData.sindicados];

    if (filtros) {
      if (filtros.nome) {
        sindicados = sindicados.filter(s => 
          s.nome.toLowerCase().includes(filtros.nome!.toLowerCase()) ||
          s.razaoSocial.toLowerCase().includes(filtros.nome!.toLowerCase()) ||
          s.cnpj.includes(filtros.nome!)
        );
      }

      if (filtros.tipo) {
        sindicados = sindicados.filter((s: Sindicado) => s.tipo === filtros.tipo);
      }

      if (filtros.status) {
        sindicados = sindicados.filter((s: Sindicado) => s.status === filtros.status);
      }

      if (filtros.verificado !== undefined) {
        sindicados = sindicados.filter((s: Sindicado) => s.verificado === filtros.verificado);
      }
    }

    return of(sindicados).pipe(delay(500)); // Simular delay de rede
  }

  // Simular busca de sindicado por ID
  buscarSindicadoPorId(id: string): Observable<Sindicado> {
    const sindicado = sindicadosData.sindicados.find((s: Sindicado) => s.id === id);
    if (!sindicado) {
      throw new Error('Sindicado não encontrado');
    }
    return of(sindicado).pipe(delay(300));
  }

  // Simular criação de sindicado
  criarSindicado(sindicado: Partial<Sindicado>): Observable<Sindicado> {
    const novoSindicado: Sindicado = {
      id: this.gerarId(),
      nome: sindicado.nome || '',
      email: sindicado.email || '',
      telefone: sindicado.telefone || '',
      cnpj: sindicado.cnpj || '',
      razaoSocial: sindicado.razaoSocial || '',
      nomeResponsavel: sindicado.nomeResponsavel || '',
      tipo: sindicado.tipo || 'cooperativa',
      status: 'pendente',
      verificado: false,
      advogadosVinculados: [],
      processosVinculados: [],
      dataCadastro: new Date().toISOString(),
      cep: sindicado.cep || '',
      endereco: sindicado.endereco || '',
      numero: sindicado.numero || '',
      complemento: sindicado.complemento || '',
      bairro: sindicado.bairro || '',
      cidade: sindicado.cidade || '',
      estado: sindicado.estado || '',
      dataFundacao: sindicado.dataFundacao,
      numeroAssociados: sindicado.numeroAssociados,
      areaAtuacao: sindicado.areaAtuacao,
      observacoes: sindicado.observacoes,
      registroSindical: sindicado.registroSindical,
      dataRegistroSindical: sindicado.dataRegistroSindical,
      orgaoRegistro: sindicado.orgaoRegistro,
      representanteLegal: sindicado.representanteLegal,
      cpfRepresentante: sindicado.cpfRepresentante,
      cargoRepresentante: sindicado.cargoRepresentante,
      emailRepresentante: sindicado.emailRepresentante,
      telefoneRepresentante: sindicado.telefoneRepresentante,
      statusVerificacao: 'pendente',
      documentosComprobatorios: []
    };

    // Adicionar à lista de sindicados
    sindicadosData.sindicados.push(novoSindicado);
    this.atualizarEstatisticas();

    return of(novoSindicado).pipe(delay(800));
  }

  // Simular atualização de sindicado
  atualizarSindicado(id: string, sindicado: Partial<Sindicado>): Observable<Sindicado> {
    const index = sindicadosData.sindicados.findIndex((s: Sindicado) => s.id === id);
    if (index === -1) {
      throw new Error('Sindicado não encontrado');
    }

    sindicadosData.sindicados[index] = { ...sindicadosData.sindicados[index], ...sindicado };
    this.atualizarEstatisticas();

    return of(sindicadosData.sindicados[index]).pipe(delay(600));
  }

  // Simular exclusão de sindicado
  excluirSindicado(id: string): Observable<void> {
    const index = sindicadosData.sindicados.findIndex((s: Sindicado) => s.id === id);
    if (index === -1) {
      throw new Error('Sindicado não encontrado');
    }

    sindicadosData.sindicados.splice(index, 1);
    this.atualizarEstatisticas();

    return of(undefined).pipe(delay(400));
  }

  // Simular busca de estatísticas
  buscarEstatisticas(): Observable<SindicadoEstatisticas> {
    return of(sindicadosData.estatisticas).pipe(delay(200));
  }

  // Simular vinculação de advogado
  vincularAdvogado(sindicadoId: string, advogadoId: string): Observable<void> {
    const sindicado = sindicadosData.sindicados.find((s: Sindicado) => s.id === sindicadoId);
    if (!sindicado) {
      throw new Error('Sindicado não encontrado');
    }

    if (!sindicado.advogadosVinculados) {
      sindicado.advogadosVinculados = [];
    }

    if (!sindicado.advogadosVinculados.includes(advogadoId)) {
      sindicado.advogadosVinculados.push(advogadoId);
    }

    return of(undefined).pipe(delay(300));
  }

  // Simular desvinculação de advogado
  desvincularAdvogado(sindicadoId: string, advogadoId: string): Observable<void> {
    const sindicado = sindicadosData.sindicados.find((s: Sindicado) => s.id === sindicadoId);
    if (!sindicado) {
      throw new Error('Sindicado não encontrado');
    }

    if (sindicado.advogadosVinculados) {
      sindicado.advogadosVinculados = sindicado.advogadosVinculados.filter((id: string) => id !== advogadoId);
    }

    return of(undefined).pipe(delay(300));
  }

  // Simular busca de advogados vinculados
  buscarAdvogadosVinculados(sindicadoId: string): Observable<any[]> {
    const sindicado = sindicadosData.sindicados.find((s: Sindicado) => s.id === sindicadoId);
    if (!sindicado) {
      throw new Error('Sindicado não encontrado');
    }

    // Simular dados de advogados (em um cenário real, viria de outro serviço)
    const advogados = [
      { id: '1', nome: 'Dr. Carlos Oliveira', oab: 'SP 123456', especialidades: ['Trabalhista', 'Civil'] },
      { id: '2', nome: 'Dra. Ana Costa', oab: 'SP 654321', especialidades: ['Família', 'Criminal'] },
      { id: '3', nome: 'Dr. Pedro Lima', oab: 'SP 789123', especialidades: ['Tributário', 'Empresarial'] }
    ];

    const advogadosVinculados = advogados.filter(adv => 
      sindicado.advogadosVinculados?.includes(adv.id)
    );

    return of(advogadosVinculados).pipe(delay(400));
  }

  // Simular vinculação de processo
  vincularProcesso(sindicadoId: string, processoId: string): Observable<void> {
    const sindicado = sindicadosData.sindicados.find((s: Sindicado) => s.id === sindicadoId);
    if (!sindicado) {
      throw new Error('Sindicado não encontrado');
    }

    if (!sindicado.processosVinculados) {
      sindicado.processosVinculados = [];
    }

    if (!sindicado.processosVinculados.includes(processoId)) {
      sindicado.processosVinculados.push(processoId);
    }

    return of(undefined).pipe(delay(300));
  }

  // Simular desvinculação de processo
  desvincularProcesso(sindicadoId: string, processoId: string): Observable<void> {
    const sindicado = sindicadosData.sindicados.find((s: Sindicado) => s.id === sindicadoId);
    if (!sindicado) {
      throw new Error('Sindicado não encontrado');
    }

    if (sindicado.processosVinculados) {
      sindicado.processosVinculados = sindicado.processosVinculados.filter((id: string) => id !== processoId);
    }

    return of(undefined).pipe(delay(300));
  }

  // Simular busca de processos vinculados
  buscarProcessosVinculados(sindicadoId: string): Observable<any[]> {
    const sindicado = sindicadosData.sindicados.find((s: Sindicado) => s.id === sindicadoId);
    if (!sindicado) {
      throw new Error('Sindicado não encontrado');
    }

    // Retornar processos vinculados baseados nos IDs
    const processosVinculados = sindicadosData.vinculacoesProcessos.filter((v: any) => 
      v.sindicadoId === sindicadoId
    );

    return of(processosVinculados).pipe(delay(400));
  }

  // Simular importação de advogados
  importarAdvogados(sindicadoId: string, arquivo: File): Observable<any> {
    // Simular processamento do arquivo
    const resultado = {
      importados: Math.floor(Math.random() * 10) + 1,
      erros: Math.floor(Math.random() * 3),
      total: Math.floor(Math.random() * 15) + 5
    };

    return of(resultado).pipe(delay(2000)); // Simular processamento demorado
  }

  // Simular verificação de sindicado
  verificarSindicado(id: string): Observable<Sindicado> {
    const sindicado = sindicadosData.sindicados.find((s: any) => s.id === id);
    if (!sindicado) {
      throw new Error('Sindicado não encontrado');
    }

    sindicado.verificado = true;
    sindicado.statusVerificacao = 'aprovado';
    sindicado.dataVerificacao = new Date().toISOString();
    sindicado.verificadoPor = 'admin@plataforma.com';

    this.atualizarEstatisticas();

    return of(sindicado).pipe(delay(600));
  }

  // Simular rejeição de sindicado
  rejeitarSindicado(id: string, motivo: string): Observable<Sindicado> {
    const sindicado = sindicadosData.sindicados.find((s: any) => s.id === id);
    if (!sindicado) {
      throw new Error('Sindicado não encontrado');
    }

    sindicado.verificado = false;
    sindicado.statusVerificacao = 'rejeitado';
    sindicado.motivoRejeicao = motivo;
    sindicado.dataVerificacao = new Date().toISOString();
    sindicado.verificadoPor = 'admin@plataforma.com';

    this.atualizarEstatisticas();

    return of(sindicado).pipe(delay(600));
  }

  // Simular upload de documento comprobatório
  uploadDocumentoComprobatorio(sindicadoId: string, arquivo: File, tipo: string): Observable<DocumentoComprobatorio> {
    const sindicado = sindicadosData.sindicados.find((s: Sindicado) => s.id === sindicadoId);
    if (!sindicado) {
      throw new Error('Sindicado não encontrado');
    }

    const novoDocumento: DocumentoComprobatorio = {
      id: this.gerarId(),
      nome: arquivo.name,
      tipo: tipo as any,
      arquivo: `/uploads/documentos/${arquivo.name}`,
      tamanho: arquivo.size,
      dataUpload: new Date().toISOString(),
      verificado: false,
      observacoes: '',
      prioridade: 'media',
      status: 'pendente'
    };

    if (!sindicado.documentosComprobatorios) {
      sindicado.documentosComprobatorios = [];
    }

    sindicado.documentosComprobatorios.push(novoDocumento);

    return of(novoDocumento).pipe(delay(1000));
  }

  // Simular remoção de documento comprobatório
  removerDocumentoComprobatorio(sindicadoId: string, documentoId: string): Observable<void> {
    const sindicado = sindicadosData.sindicados.find((s: Sindicado) => s.id === sindicadoId);
    if (!sindicado) {
      throw new Error('Sindicado não encontrado');
    }

    if (sindicado.documentosComprobatorios) {
      sindicado.documentosComprobatorios = sindicado.documentosComprobatorios.filter(
        (doc: any) => doc.id !== documentoId
      );
    }

    return of(undefined).pipe(delay(400));
  }

  // Simular busca de documentos comprobatórios
  buscarDocumentosComprobatorios(sindicadoId: string): Observable<DocumentoComprobatorio[]> {
    const sindicado = sindicadosData.sindicados.find((s: Sindicado) => s.id === sindicadoId);
    if (!sindicado) {
      throw new Error('Sindicado não encontrado');
    }

    return of(sindicado.documentosComprobatorios || []).pipe(delay(300));
  }

  // Simular verificação de documento
  verificarDocumento(sindicadoId: string, documentoId: string): Observable<DocumentoComprobatorio> {
    const sindicado = sindicadosData.sindicados.find((s: Sindicado) => s.id === sindicadoId);
    if (!sindicado) {
      throw new Error('Sindicado não encontrado');
    }

    const documento = sindicado.documentosComprobatorios?.find((doc: any) => doc.id === documentoId);
    if (!documento) {
      throw new Error('Documento não encontrado');
    }

    documento.verificado = true;
    documento.status = 'aprovado';
    documento.dataVerificacao = new Date().toISOString();
    documento.verificadoPor = 'admin@plataforma.com';

    return of(documento).pipe(delay(500));
  }

  // Utilitários
  private gerarId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private atualizarEstatisticas(): void {
    const sindicados = sindicadosData.sindicados;
    
    sindicadosData.estatisticas = {
      total: sindicados.length,
      ativos: sindicados.filter((s: Sindicado) => s.status === 'ativo').length,
      inativos: sindicados.filter((s: Sindicado) => s.status === 'inativo').length,
      pendentes: sindicados.filter((s: Sindicado) => s.status === 'pendente').length,
      cooperativas: sindicados.filter((s: Sindicado) => s.tipo === 'cooperativa').length,
      sindicatos: sindicados.filter((s: Sindicado) => s.tipo === 'sindicato').length,
      verificados: sindicados.filter((s: Sindicado) => s.verificado).length,
      naoVerificados: sindicados.filter((s: Sindicado) => !s.verificado).length
    };
  }

  // Métodos utilitários para ícones e labels
  getTipoIcon(tipo: string): string {
    switch (tipo) {
      case 'cooperativa':
        return 'pi pi-building';
      case 'sindicato':
        return 'pi pi-users';
      default:
        return 'pi pi-building';
    }
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'cooperativa':
        return 'Cooperativa';
      case 'sindicato':
        return 'Sindicato';
      default:
        return 'Sindicado';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ativo':
        return 'pi pi-check-circle text-green-500';
      case 'inativo':
        return 'pi pi-times-circle text-red-500';
      case 'pendente':
        return 'pi pi-clock text-yellow-500';
      default:
        return 'pi pi-question-circle text-gray-500';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'inativo':
        return 'Inativo';
      case 'pendente':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  }

  // Métodos para obter dados de teste
  getSindicadosData(): any {
    return sindicadosData;
  }

  getProcessosDisponiveis(): any[] {
    return sindicadosData.processosDisponiveis;
  }

  getVinculacoesProcessos(): any[] {
    return sindicadosData.vinculacoesProcessos;
  }
}
