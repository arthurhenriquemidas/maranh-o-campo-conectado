import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, map, shareReplay, throwError } from 'rxjs';
import { FaqItem } from '../models/faq.model';

@Injectable({ providedIn: 'root' })
export class MockFaqService {
  private readonly endpoint = 'assets/mock/faq.json';
  private cache$?: Observable<FaqItem[]>;

  constructor(private readonly http: HttpClient) {}

  getFaq(): Observable<FaqItem[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<FaqItem[]>(this.endpoint).pipe(
        delay(350),
        shareReplay(1),
        catchError(() => throwError(() => new Error('mock:faq:load-failed')))
      );
    }
    return this.cache$!;
  }

  getByAudience(audience: FaqItem['audience'] | 'todos'): Observable<FaqItem[]> {
    return this.getFaq().pipe(
      map(items => (audience === 'todos' ? items : items.filter(item => item.audience === audience || item.audience === 'geral')))
    );
  }
}

