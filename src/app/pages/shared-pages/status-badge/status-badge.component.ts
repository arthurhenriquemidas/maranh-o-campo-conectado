import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProcessStatus } from '../../advogado/processos/processos.component';

@Component({
    selector: 'app-status-badge',
    templateUrl: './status-badge.component.html',
    styleUrls: ['./status-badge.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: ProcessStatus;

  readonly mapping: Record<ProcessStatus, { severity: 'info' | 'success' | 'warning' | 'danger'; icon: string; labelKey: string }> = {
    ABERTO: { severity: 'info', icon: 'pi pi-folder-open', labelKey: 'Aberto' },
    EM_ANDAMENTO: { severity: 'info', icon: 'pi pi-play', labelKey: 'Em Andamento' },
    AGUARDANDO_CLIENTE: { severity: 'warning', icon: 'pi pi-user-clock', labelKey: 'Aguardando Cliente' },
    CONCLUIDO: { severity: 'success', icon: 'pi pi-check-circle', labelKey: 'Concluído' },
    ARQUIVADO: { severity: 'danger', icon: 'pi pi-archive', labelKey: 'Arquivado' }
  };
}
