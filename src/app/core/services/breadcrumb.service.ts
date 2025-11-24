import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly breadcrumbs$ = new BehaviorSubject<MenuItem[]>([]);

  get stream() {
    return this.breadcrumbs$.asObservable();
  }

  set(items: MenuItem[]): void {
    this.breadcrumbs$.next(items);
  }

  reset(): void {
    this.breadcrumbs$.next([]);
  }
}
