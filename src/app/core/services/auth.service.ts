import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthUser, LoginCredentials, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Verificar se há um usuário logado no localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginCredentials): Observable<AuthUser> {
    // Simular autenticação com delay
    return of(null).pipe(
      delay(1500), // Simular tempo de resposta da API
      map(() => {
        // Dados mock para autenticação
        const mockUsers = {
          'joao.silva@email.com': {
            id: '1',
            nome: 'João Silva',
            email: 'joao.silva@email.com',
            tipo: 'cliente' as const,
            token: 'mock-jwt-token-cliente'
          },
          'carlos.oliveira@adv.com': {
            id: '1',
            nome: 'Dr. Carlos Oliveira',
            email: 'carlos.oliveira@adv.com',
            tipo: 'advogado' as const,
            token: 'mock-jwt-token-advogado'
          },
          'admin@plataforma.com': {
            id: '1',
            nome: 'Admin Sistema',
            email: 'admin@plataforma.com',
            tipo: 'admin' as const,
            token: 'mock-jwt-token-admin'
          }
        };

        const user = mockUsers[credentials.email as keyof typeof mockUsers];
        
        if (!user || credentials.password !== '123456') {
          throw new Error('Credenciais inválidas');
        }

        // Salvar no localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        return user;
      })
    );
  }

  register(data: RegisterData): Observable<{ success: boolean; message: string }> {
    return of(null).pipe(
      delay(2000), // Simular tempo de resposta da API
      map(() => {
        // Simular validações
        if (data.email === 'email@existente.com') {
          throw new Error('E-mail já cadastrado');
        }

        if (data.password !== data.confirmPassword) {
          throw new Error('Senhas não coincidem');
        }

        return {
          success: true,
          message: 'Cadastro realizado com sucesso! Verifique seu e-mail.'
        };
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  forgotPassword(email: string): Observable<{ success: boolean; message: string }> {
    return of(null).pipe(
      delay(1000),
      map(() => ({
        success: true,
        message: 'E-mail de recuperação enviado com sucesso!'
      }))
    );
  }

  resetPassword(token: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    return of(null).pipe(
      delay(1000),
      map(() => ({
        success: true,
        message: 'Senha redefinida com sucesso!'
      }))
    );
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  isCliente(): boolean {
    const user = this.getCurrentUser();
    return user?.tipo === 'cliente';
  }

  isAdvogado(): boolean {
    const user = this.getCurrentUser();
    return user?.tipo === 'advogado';
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.tipo === 'admin';
  }
}
