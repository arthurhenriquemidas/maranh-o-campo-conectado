import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { DataState } from '../../shared/types/data-state';

export interface AgendaEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  customer: string;
  status: 'agendado' | 'confirmado' | 'realizado' | 'cancelado';
  processId: string;
  local: string;
  tipo: 'audiência' | 'reunião' | 'prazo' | 'entrega' | 'consulta';
  prioridade: 'baixa' | 'média' | 'alta' | 'urgente';
}

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private agendaEvents: AgendaEvent[] = [
    {
      id: '1',
      title: 'Audiência de Conciliação',
      description: 'Audiência de conciliação no processo de divórcio consensual',
      date: new Date(2024, 2, 15, 14, 30),
      customer: 'Maria Silva Santos',
      status: 'confirmado',
      processId: 'PROC-2024-001',
      local: 'Fórum Central - Sala 205',
      tipo: 'audiência',
      prioridade: 'alta'
    },
    {
      id: '2',
      title: 'Reunião com Cliente',
      description: 'Discussão sobre estratégia de defesa no processo criminal',
      date: new Date(2024, 2, 18, 10, 0),
      customer: 'João Oliveira Costa',
      status: 'agendado',
      processId: 'PROC-2024-002',
      local: 'Escritório - Sala de Reuniões',
      tipo: 'reunião',
      prioridade: 'média'
    },
    {
      id: '3',
      title: 'Prazo para Contestação',
      description: 'Prazo final para apresentação de contestação',
      date: new Date(2024, 2, 20, 18, 0),
      customer: 'Ana Paula Ferreira',
      status: 'agendado',
      processId: 'PROC-2024-003',
      local: 'Tribunal de Justiça',
      tipo: 'prazo',
      prioridade: 'urgente'
    },
    {
      id: '4',
      title: 'Entrega de Documentos',
      description: 'Entrega de documentos para análise pericial',
      date: new Date(2024, 2, 22, 9, 0),
      customer: 'Carlos Eduardo Lima',
      status: 'agendado',
      processId: 'PROC-2024-004',
      local: 'Perícia Técnica - Laboratório',
      tipo: 'entrega',
      prioridade: 'média'
    },
    {
      id: '5',
      title: 'Audiência de Instrução',
      description: 'Audiência de instrução e julgamento',
      date: new Date(2024, 2, 25, 8, 30),
      customer: 'Fernanda Rodrigues',
      status: 'confirmado',
      processId: 'PROC-2024-005',
      local: 'Fórum Regional - Sala 301',
      tipo: 'audiência',
      prioridade: 'alta'
    },
    {
      id: '6',
      title: 'Reunião de Mediação',
      description: 'Sessão de mediação para resolução de conflito',
      date: new Date(2024, 2, 28, 15, 0),
      customer: 'Roberto Alves',
      status: 'agendado',
      processId: 'PROC-2024-006',
      local: 'Centro de Mediação',
      tipo: 'reunião',
      prioridade: 'baixa'
    },
    {
      id: '7',
      title: 'Consulta Jurídica',
      description: 'Consulta sobre direitos trabalhistas',
      date: new Date(2024, 3, 2, 11, 0),
      customer: 'Patricia Mendes',
      status: 'agendado',
      processId: 'PROC-2024-007',
      local: 'Escritório - Sala de Consultas',
      tipo: 'consulta',
      prioridade: 'média'
    },
    {
      id: '8',
      title: 'Consulta Previdenciária',
      description: 'Consulta sobre aposentadoria e benefícios',
      date: new Date(2024, 3, 5, 14, 30),
      customer: 'Antonio Silva',
      status: 'confirmado',
      processId: 'PROC-2024-008',
      local: 'Escritório - Sala de Consultas',
      tipo: 'consulta',
      prioridade: 'alta'
    }
  ];

  private agendaSubject = new BehaviorSubject<DataState<AgendaEvent[]>>({
    status: 'loading',
    data: []
  });

  constructor() {
    this.loadAgenda();
  }

  getAgendaState(): Observable<DataState<AgendaEvent[]>> {
    return this.agendaSubject.asObservable();
  }

  private loadAgenda(): void {
    this.agendaSubject.next({ status: 'loading', data: [] });
    
    of(this.agendaEvents)
      .pipe(
        delay(1000), // Simula carregamento
        map(events => {
          // Ordena eventos por data
          const sortedEvents = events.sort((a, b) => a.date.getTime() - b.date.getTime());
          
          if (sortedEvents.length === 0) {
            return { status: 'empty' as const, data: [] };
          }
          
          return { status: 'success' as const, data: sortedEvents };
        })
      )
      .subscribe(state => {
        this.agendaSubject.next(state);
      });
  }

  getEventById(id: string): Observable<AgendaEvent | null> {
    const event = this.agendaEvents.find(e => e.id === id);
    return of(event || null).pipe(delay(500));
  }

  updateEventStatus(id: string, status: AgendaEvent['status']): Observable<boolean> {
    const eventIndex = this.agendaEvents.findIndex(e => e.id === id);
    
    if (eventIndex !== -1) {
      this.agendaEvents[eventIndex].status = status;
      this.loadAgenda(); // Recarrega a agenda
      return of(true).pipe(delay(500));
    }
    
    return of(false).pipe(delay(500));
  }

  addEvent(event: Omit<AgendaEvent, 'id'>): Observable<boolean> {
    const newEvent: AgendaEvent = {
      ...event,
      id: (this.agendaEvents.length + 1).toString()
    };
    
    this.agendaEvents.push(newEvent);
    this.loadAgenda(); // Recarrega a agenda
    return of(true).pipe(delay(500));
  }

  getEventsByDateRange(startDate: Date, endDate: Date): Observable<AgendaEvent[]> {
    const filteredEvents = this.agendaEvents.filter(event => 
      event.date >= startDate && event.date <= endDate
    );
    
    return of(filteredEvents).pipe(delay(300));
  }

  getUpcomingEvents(limit: number = 5): Observable<AgendaEvent[]> {
    const now = new Date();
    const upcomingEvents = this.agendaEvents
      .filter(event => event.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, limit);
    
    return of(upcomingEvents).pipe(delay(300));
  }
}
