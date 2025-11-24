import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Router } from '@angular/router';

export interface MenuItem {
  label: string;
  action?: () => void;
  routerLink?: string;
  icon?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.scss']
})
export class CustomMenuComponent {
  @Input() menuItems: MenuItem[] = [];
  @Input() logoText: string = '4Jus';
  @Input() logoAction?: () => void;
  @Input() activeMenuItem?: string;
  @Output() menuItemClick = new EventEmitter<MenuItem>();

  isMobileMenuOpen = false;

  constructor(private router: Router) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 768) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  handleMenuItemClick(item: MenuItem) {
    if (item.action) {
      item.action();
    }
    this.menuItemClick.emit(item);
    this.closeMobileMenu();
  }

  handleLogoClick() {
    if (this.logoAction) {
      this.logoAction();
    } else {
      this.menuItemClick.emit({ label: 'logo', action: () => window.location.href = '/' });
    }
    this.closeMobileMenu();
  }

  handleClientAreaClick() {
    this.router.navigate(['/auth/login']);
    this.menuItemClick.emit({
      label: 'Área do Cliente',
      routerLink: '/auth/login'
    });
  }
}
