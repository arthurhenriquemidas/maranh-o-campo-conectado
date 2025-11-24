import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-empty-state',
    templateUrl: './empty-state.component.html',
    styleUrls: ['./empty-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class EmptyStateComponent {
  @Input() icon = 'pi pi-inbox';
  @Input() titleKey = 'empty.default.title';
  @Input() descriptionKey = 'empty.default.description';
  @Input() actionLabelKey?: string;
  @Input() actionIcon = 'pi pi-plus';
  @Input() actionRouterLink?: string | any[];
  @Input() actionSeverity: 'primary' | 'secondary' | 'success' | 'info' | 'help' | 'danger' | 'warning' = 'primary';
  @Input() displayAction = true;
  @Output() action = new EventEmitter<void>();

  handleClick() {
    this.action.emit();
  }
}
