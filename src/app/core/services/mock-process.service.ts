import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, map, of, shareReplay, throwError } from 'rxjs';
import { LegalProcess } from 'src/app/pages/advogado/processos/processos.component';

@Injectable({ providedIn: 'root' })
export class MockProcessService {
  private cache$?: Observable<LegalProcess[]>;
  private readonly endpoint = 'assets/mock/processes.json';

  constructor(private readonly http: HttpClient) {}

  getProcesses(): Observable<LegalProcess[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<LegalProcess[]>(this.endpoint).pipe(
        delay(400),
        shareReplay(1),
        catchError(() => throwError(() => new Error('mock:processes:load-failed')))
      );
    }
    return this.cache$!;
  }

  getProcessById(id: string): Observable<LegalProcess | undefined> {
    return this.getProcesses().pipe(map(processes => processes.find(item => item.id === id)));
  }

  search(term: string): Observable<LegalProcess[]> {
    const normalized = term.trim().toLowerCase();
    if (!normalized) {
      return this.getProcesses();
    }

    return this.getProcesses().pipe(
      map(processes =>
        processes.filter(item =>
          item.title.toLowerCase().includes(normalized) ||
          item.reference.toLowerCase().includes(normalized) ||
          item.customerName.toLowerCase().includes(normalized) ||
          (item.lawyerName?.toLowerCase().includes(normalized) ?? false)
        )
      )
    );
  }

  refresh(): Observable<boolean> {
    this.cache$ = undefined;
    return of(true);
  }
}

