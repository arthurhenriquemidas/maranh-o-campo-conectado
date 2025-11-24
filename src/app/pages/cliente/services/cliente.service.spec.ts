import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClienteService } from './cliente.service';
import { environment } from '../../../../environments/environment';
import { Compromisso, StatusOption, TipoOption, AreaDireitoOption, ObjetivoClienteOption, NivelUrgenciaOption } from '../models/cliente.model';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClienteService]
    });
    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProximosCompromissos', () => {
    it('should return compromissos from mock when useMock is true', () => {
      environment.useMock = true;

      const mockCompromissos: Compromisso[] = [
        {
          titulo: 'Audiência - Processo Trabalhista',
          data: new Date('2024-01-25T14:00:00Z'),
          hora: '14:00'
        }
      ];

      service.getProximosCompromissos().subscribe(compromissos => {
        expect(compromissos).toEqual(mockCompromissos);
      });

      const req = httpMock.expectOne('assets/mock/cliente/compromissos.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockCompromissos);
    });

    it('should return compromissos from API when useMock is false', () => {
      environment.useMock = false;

      const mockCompromissos: Compromisso[] = [];

      service.getProximosCompromissos().subscribe(compromissos => {
        expect(compromissos).toEqual(mockCompromissos);
      });

      const req = httpMock.expectOne('/api/cliente/compromissos');
      expect(req.request.method).toBe('GET');
      req.flush(mockCompromissos);
    });
  });

  describe('getStatusOptions', () => {
    it('should return status options from mock when useMock is true', () => {
      environment.useMock = true;

      const mockOptions: StatusOption[] = [
        { label: 'Aguardando', value: 'aberto' },
        { label: 'Em Andamento', value: 'em_andamento' }
      ];

      service.getStatusOptions().subscribe(options => {
        expect(options).toEqual(mockOptions);
      });

      const req = httpMock.expectOne('assets/mock/cliente/options.json');
      expect(req.request.method).toBe('GET');
      req.flush({ statusOptions: mockOptions });
    });
  });

  describe('getAreasDireito', () => {
    it('should return areas do direito from mock when useMock is true', () => {
      environment.useMock = true;

      const mockOptions: AreaDireitoOption[] = [
        { label: 'Cível', value: 'civil' },
        { label: 'Trabalhista', value: 'trabalhista' }
      ];

      service.getAreasDireito().subscribe(options => {
        expect(options).toEqual(mockOptions);
      });

      const req = httpMock.expectOne('assets/mock/cliente/options.json');
      expect(req.request.method).toBe('GET');
      req.flush({ areasDireito: mockOptions });
    });
  });

  describe('getMenuItems', () => {
    it('should return menu items from mock when useMock is true', () => {
      environment.useMock = true;

      const mockMenuItems = [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          routerLink: ['/cliente/dashboard']
        }
      ];

      service.getMenuItems().subscribe(menuItems => {
        expect(menuItems).toEqual(mockMenuItems);
      });

      const req = httpMock.expectOne('assets/mock/cliente/options.json');
      expect(req.request.method).toBe('GET');
      req.flush({ menuItems: mockMenuItems });
    });
  });

  describe('analisarComIA', () => {
    it('should simulate IA analysis when useMock is true', () => {
      environment.useMock = true;

      const descricao = 'Fui demitido sem receber meus direitos trabalhistas';
      const mockResult = {
        titulo: 'Ação Trabalhista - Rescisão Indevida',
        areaDireito: 'trabalhista',
        objetivo: 'indenizacao',
        urgencia: 'media',
        valorPretendido: 15000,
        descricao: descricao
      };

      service.analisarComIA(descricao).subscribe(result => {
        expect(result.titulo).toBe('Ação Trabalhista - Rescisão Indevida');
        expect(result.areaDireito).toBe('trabalhista');
        expect(result.valorPretendido).toBe(15000);
      });

      // Como é uma simulação, não há requisição HTTP para verificar
    });
  });

  describe('corrigirTexto', () => {
    it('should simulate text correction when useMock is true', () => {
      environment.useMock = true;

      const textoOriginal = 'vc td pq nao ta td bem';
      const textoCorrigido = 'você tudo porque não está tudo bem';

      service.corrigirTexto(textoOriginal).subscribe(result => {
        expect(result).toBe(textoCorrigido);
      });

      // Como é uma simulação, não há requisição HTTP para verificar
    });
  });
});

