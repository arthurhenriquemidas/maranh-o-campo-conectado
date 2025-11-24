import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, interval, of, Subject } from 'rxjs';
import { delay, map, filter, switchMap, takeUntil } from 'rxjs/operators';

import { 
  ChatMessage, 
  ChatConversation, 
  SendMessageRequest, 
  TypingIndicator,
  ChatStatus,
  ChatNotification 
} from '../models/chat.model';
import { AuthService } from './auth.service';
import { AuthUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private conversationsSubject = new BehaviorSubject<ChatConversation[]>([]);
  
  public messages$ = this.messagesSubject.asObservable();
  public conversations$ = this.conversationsSubject.asObservable();

  private mockMessages: ChatMessage[] = [];
  private currentUser: AuthUser | null = null;

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Mock messages básicos
    this.mockMessages = [
      {
        id: '1',
        processoId: 'P001',
        remetente: {
          id: '1',
          nome: 'João Silva',
          tipo: 'cliente'
        },
        destinatario: {
          id: '1',
          nome: 'Dr. Carlos Oliveira',
          tipo: 'advogado'
        },
        conteudo: 'Olá! Gostaria de saber sobre o andamento do processo.',
        tipo: 'texto',
        dataEnvio: new Date(2024, 0, 15, 14, 30),
        status: 'lido',
        dataLeitura: new Date(2024, 0, 15, 14, 35)
      },
      {
        id: '2',
        processoId: 'P001',
        remetente: {
          id: '1',
          nome: 'Dr. Carlos Oliveira',
          tipo: 'advogado'
        },
        destinatario: {
          id: '1',
          nome: 'João Silva',
          tipo: 'cliente'
        },
        conteudo: 'Olá! Estou analisando toda a documentação. Em breve terei um posicionamento.',
        tipo: 'texto',
        dataEnvio: new Date(2024, 0, 15, 16, 15),
        status: 'lido'
      }
    ];

    this.messagesSubject.next(this.mockMessages);
  }

  getMessagesByProcesso(processoId: string): Observable<ChatMessage[]> {
    return this.messages$.pipe(
      map(messages => messages.filter(m => m.processoId === processoId)),
      delay(300)
    );
  }

  sendMessage(request: SendMessageRequest): Observable<ChatMessage> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          processoId: request.processoId,
          remetente: {
            id: this.currentUser?.id || '1',
            nome: this.currentUser?.nome || 'Usuário',
            tipo: this.currentUser?.tipo || 'cliente'
          },
          destinatario: {
            id: '1',
            nome: this.currentUser?.tipo === 'cliente' ? 'Dr. Carlos Oliveira' : 'João Silva',
            tipo: this.currentUser?.tipo === 'cliente' ? 'advogado' : 'cliente'
          },
          conteudo: request.conteudo,
          tipo: request.tipo || 'texto',
          dataEnvio: new Date(),
          status: 'enviado'
        };

        this.mockMessages.push(newMessage);
        this.messagesSubject.next([...this.mockMessages]);

        return newMessage;
      })
    );
  }
}
