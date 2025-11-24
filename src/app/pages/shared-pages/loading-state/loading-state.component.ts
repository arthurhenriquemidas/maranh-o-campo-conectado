import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'app-loading-state',
    templateUrl: './loading-state.component.html',
    styleUrls: ['./loading-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class LoadingStateComponent {
  @Input() rows = 3;
  @Input() card = false;
  protected readonly placeholders = Array.from({ length: 6 }).map((_, index) => index);

  get skeletons(): number[] {
    return Array.from({ length: this.rows }).map((_, index) => index);
  }
}
