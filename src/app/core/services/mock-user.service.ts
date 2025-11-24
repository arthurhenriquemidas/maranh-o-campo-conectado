import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, map, shareReplay, throwError } from 'rxjs';
import { UserProfile, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class MockUserService {
  private readonly endpoint = 'assets/mock/users.json';
  private cache$?: Observable<UserProfile[]>;

  constructor(private readonly http: HttpClient) {}

  getUsers(): Observable<UserProfile[]> {
    if (!this.cache$) {
      this.cache$ = this.http.get<UserProfile[]>(this.endpoint).pipe(
        delay(300),
        shareReplay(1),
        catchError(() => throwError(() => new Error('mock:users:load-failed')))
      );
    }

    return this.cache$!;
  }

  getByRole(role: UserRole): Observable<UserProfile[]> {
    return this.getUsers().pipe(map(users => users.filter(user => user.role === role)));
  }

  getById(id: string): Observable<UserProfile | undefined> {
    return this.getUsers().pipe(map(users => users.find(user => user.id === id)));
  }
}

