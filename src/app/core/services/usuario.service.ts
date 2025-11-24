import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Cliente, Advogado, Admin, AuthUser } from '../models/user.model';

export interface UsuarioEstatisticas {
  totalClientes: number;
  totalAdvogados: number;
  totalAdmins: number;
  totalSindicados: number;
  clientesAtivos: number;
  advogadosVerificados: number;
  advogadosPendentes: number;
  sindicadosVerificados: number;
  sindicadosPendentes: number;
  usuariosRecentes: number;
}

export interface UsuarioFiltro {
  tipo?: 'cliente' | 'advogado' | 'admin' | 'sindicado';
  status?: 'ativo' | 'inativo' | 'pendente';
  verificado?: boolean;
  busca?: string;
  dataInicio?: Date;
  dataFim?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuariosSubject = new BehaviorSubject<AuthUser[]>([]);
  public usuarios$ = this.usuariosSubject.asObservable();

  private mockUsuarios: AuthUser[] = [];

  constructor(private http: HttpClient) {
    this.loadMockData();
  }

  private async loadMockData(): Promise<void> {
    try {
      const data = await this.http.get<any>('assets/mock/usuarios.json').toPromise();

      // Transformar dados mock em formato AuthUser
      const usuarios: AuthUser[] = [
        // Clientes
        ...data.clientes.map((cliente: any) => ({
          id: cliente.id,
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone,
          tipo: 'cliente' as const,
          status: cliente.status,
          dataCadastro: cliente.dataCadastro,
          // Propriedades específicas do cliente
          cpf: cliente.cpf,
          cnpj: cliente.cnpj,
          tipoCliente: cliente.tipo,
          verificado: cliente.verificado
        })),
        // Advogados
        ...data.advogados.map((advogado: any) => ({
          id: advogado.id,
          nome: advogado.nome,
          email: advogado.email,
          telefone: advogado.telefone,
          tipo: 'advogado' as const,
          status: advogado.status,
          dataCadastro: advogado.dataCadastro,
          // Propriedades específicas do advogado
          oab: advogado.oab,
          especialidades: advogado.especialidades,
          verificado: advogado.verificado,
          avaliacaoMedia: advogado.avaliacaoMedia,
          totalProcessos: advogado.totalProcessos
        })),
        // Admins
        ...data.admins.map((admin: any) => ({
          id: admin.id,
          nome: admin.nome,
          email: admin.email,
          telefone: admin.telefone,
          tipo: 'admin' as const,
          status: admin.status,
          dataCadastro: admin.dataCadastro
        })),
        // Sindicados (comentado temporariamente)
        // ...data.sindicados?.map((sindicado: any) => ({
        //   id: sindicado.id,
        //   nome: sindicado.nome,
        //   email: sindicado.email,
        //   telefone: sindicado.telefone,
        //   tipo: 'sindicado' as const,
        //   status: sindicado.status,
        //   dataCadastro: sindicado.dataCadastro,
        //   verificado: sindicado.verificado,
        //   // Propriedades específicas do sindicado
        //   cnpj: sindicado.cnpj,
        //   razaoSocial: sindicado.razaoSocial,
        //   nomeResponsavel: sindicado.nomeResponsavel,
        //   tipoSindicado: sindicado.tipo
        // })) || []
      ];

      this.mockUsuarios = usuarios;
      this.usuariosSubject.next(usuarios);
    } catch (error) {
      console.error('Erro ao carregar usuários mock:', error);
    }
  }

  // Métodos públicos
  getUsuarios(filtro?: UsuarioFiltro): Observable<AuthUser[]> {
    return this.usuarios$.pipe(
      delay(400),
      map(usuarios => {
        let resultado = [...usuarios];

        if (filtro) {
          if (filtro.tipo) {
            resultado = resultado.filter(u => u.tipo === filtro.tipo);
          }
          if (filtro.status) {
            resultado = resultado.filter(u => u.status === filtro.status);
          }
          if (filtro.verificado !== undefined) {
            resultado = resultado.filter(u => u.verificado === filtro.verificado);
          }
          if (filtro.busca) {
            const busca = filtro.busca.toLowerCase();
            resultado = resultado.filter(u =>
              u.nome.toLowerCase().includes(busca) ||
              u.email.toLowerCase().includes(busca) ||
              u.telefone?.includes(busca)
            );
          }
          if (filtro.dataInicio) {
            resultado = resultado.filter(u =>
              u.dataCadastro && new Date(u.dataCadastro) >= filtro.dataInicio!
            );
          }
          if (filtro.dataFim) {
            resultado = resultado.filter(u =>
              u.dataCadastro && new Date(u.dataCadastro) <= filtro.dataFim!
            );
          }
        }

        return resultado.sort((a, b) => {
          const dateA = a.dataCadastro ? new Date(a.dataCadastro).getTime() : 0;
          const dateB = b.dataCadastro ? new Date(b.dataCadastro).getTime() : 0;
          return dateB - dateA;
        });
      })
    );
  }

  getUsuarioById(id: string): Observable<AuthUser | null> {
    return this.usuarios$.pipe(
      delay(200),
      map(usuarios => usuarios.find(u => u.id === id) || null)
    );
  }

  getEstatisticas(): Observable<UsuarioEstatisticas> {
    return this.usuarios$.pipe(
      delay(300),
      map(usuarios => {
        const clientes = usuarios.filter(u => u.tipo === 'cliente');
        const advogados = usuarios.filter(u => u.tipo === 'advogado');
        const admins = usuarios.filter(u => u.tipo === 'admin');
        const sindicados = usuarios.filter(u => u.tipo === 'sindicado');

        const umaSemanaAtras = new Date();
        umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);

        return {
          totalClientes: clientes.length,
          totalAdvogados: advogados.length,
          totalAdmins: admins.length,
          totalSindicados: 0, // Temporariamente desabilitado
          clientesAtivos: clientes.filter(c => c.status === 'ativo').length,
          advogadosVerificados: advogados.filter(a => a.verificado).length,
          advogadosPendentes: advogados.filter(a => !a.verificado).length,
          sindicadosVerificados: 0, // Temporariamente desabilitado
          sindicadosPendentes: 0, // Temporariamente desabilitado
          usuariosRecentes: usuarios.filter(u =>
            u.dataCadastro && new Date(u.dataCadastro) > umaSemanaAtras
          ).length
        };
      })
    );
  }

  atualizarUsuario(id: string, updates: Partial<AuthUser>): Observable<AuthUser> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const usuario = this.mockUsuarios.find(u => u.id === id);
        if (!usuario) {
          throw new Error('Usuário não encontrado');
        }

        Object.assign(usuario, updates);
        this.usuariosSubject.next([...this.mockUsuarios]);
        
        return usuario;
      })
    );
  }

  alterarStatusUsuario(id: string, novoStatus: string): Observable<boolean> {
    return this.atualizarUsuario(id, { status: novoStatus as any }).pipe(
      map(() => true)
    );
  }

  verificarAdvogado(id: string, verificado: boolean): Observable<boolean> {
    return this.atualizarUsuario(id, { verificado }).pipe(
      map(() => true)
    );
  }

  excluirUsuario(id: string): Observable<boolean> {
    return of(true).pipe(
      delay(300),
      map(() => {
        const index = this.mockUsuarios.findIndex(u => u.id === id);
        if (index >= 0) {
          this.mockUsuarios.splice(index, 1);
          this.usuariosSubject.next([...this.mockUsuarios]);
          return true;
        }
        throw new Error('Usuário não encontrado');
      })
    );
  }

  // Métodos utilitários
  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'ativo': 'Ativo',
      'inativo': 'Inativo',
      'pendente': 'Pendente',
      'suspenso': 'Suspenso'
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'ativo': return 'success';
      case 'inativo': return 'secondary';
      case 'pendente': return 'warning';
      case 'suspenso': return 'danger';
      default: return 'info';
    }
  }

  getTipoLabel(tipo: string): string {
    const labels: { [key: string]: string } = {
      'cliente': 'Cliente',
      'advogado': 'Advogado',
      'admin': 'Administrador',
      'sindicado': 'Sindicado/Cooperativa'
    };
    return labels[tipo] || tipo;
  }

  getTipoIcon(tipo: string): string {
    const icons: { [key: string]: string } = {
      'cliente': 'pi pi-user',
      'advogado': 'pi pi-balance-scale',
      'admin': 'pi pi-cog',
      'sindicado': 'pi pi-building'
    };
    return icons[tipo] || 'pi pi-user';
  }

  formatarData(data: string | Date): string {
    const date = typeof data === 'string' ? new Date(data) : data;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}