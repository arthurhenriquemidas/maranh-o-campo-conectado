import { MenuItem } from 'primeng/api';

export interface Compromisso {
  titulo: string;
  data: Date;
  hora: string;
}

export interface StatusOption {
  label: string;
  value: string;
}

export interface TipoOption {
  label: string;
  value: string;
}

export interface AreaDireitoOption {
  label: string;
  value: string;
}

export interface ObjetivoClienteOption {
  label: string;
  value: string;
}

export interface NivelUrgenciaOption {
  label: string;
  value: string;
}

export interface ClienteMockData {
  compromissos: Compromisso[];
  statusOptions: StatusOption[];
  tipoOptions: TipoOption[];
  areasDireito: AreaDireitoOption[];
  objetivosCliente: ObjetivoClienteOption[];
  niveisUrgencia: NivelUrgenciaOption[];
  menuItems: MenuItem[];
}

