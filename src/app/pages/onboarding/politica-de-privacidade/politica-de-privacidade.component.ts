import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface MenuItem {
  label: string;
  action?: () => void;
  routerLink?: string;
  icon?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-politica-de-privacidade',
  templateUrl: './politica-de-privacidade.component.html',
  styleUrls: ['./politica-de-privacidade.component.scss']
})
export class PoliticaDePrivacidadeComponent implements OnInit {

  menuItems: MenuItem[] = [];
  activeMenuItem: string = 'Política de Privacidade';

  constructor(private router: Router) {
    this.initializeMenu();
  }

  ngOnInit(): void {
    // Component initialization
  }

  private initializeMenu() {
    this.menuItems = [
      {
        label: 'Sobre nós',
        action: () => this.navegarPara('/onboarding/sobre')
      },
      {
        label: 'Ajuda',
        action: () => this.navegarPara('/onboarding/ajuda')
      },
      {
        label: 'Blog',
        action: () => this.navegarPara('/onboarding/blog')
      },
      {
        label: 'Contato',
        action: () => this.navegarPara('/onboarding/contato')
      },
      {
        label: 'Seja um Advogado',
        action: () => this.navegarPara('/onboarding/seja-advogado')
      }
    ];
  }

  navegarPara(rota: string): void {
    this.router.navigate([rota]);
  }

  onMenuItemClick(item: MenuItem) {
    if (item.action) {
      item.action();
    }
  }

  onLogoClick() {
    this.router.navigate(['/']);
  }
}
