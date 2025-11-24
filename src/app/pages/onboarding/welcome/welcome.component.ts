import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

export interface MenuItem {
  label: string;
  action?: () => void;
  routerLink?: string;
  icon?: string;
  children?: MenuItem[];
}

export interface HelpStep {
  reportType: string;
  title: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit {

  menuItems: MenuItem[] = [];
  activeMenuItem: string = '';
  currentCount: number = 0;
  targetCount: number = 10000;
  countingSpeed: number = 50; // milliseconds
  hasCounted: boolean = false;

  // Análise de problema properties
  problemDescription: string = '';
  isAnalyzing: boolean = false;
  showAnalysis: boolean = false;
  showRegistration: boolean = false;
  loadingProgress: number = 0;
  analysisTimer: any;
  potentialAmount: number = 0;

  // Help Mode toggle
  showHelpMode: boolean = false;
  helpSteps: HelpStep[] = [];

  @ViewChild('counterElement', { static: true })
  counterElement!: ElementRef<HTMLHeadingElement>;

  constructor(private router: Router) {
    this.initializeMenu();
    this.initializeHelpSteps();
  }

  ngOnInit() {
    // Component initialization
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
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
        action: () => {
          this.navegarPara('/onboarding/blog');
        }
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

  private initializeHelpSteps(): void {
    this.helpSteps = [
      {
        reportType: 'Trabalhista',
        title: 'Direitos Trabalhistas',
        description: 'Demissão sem justa causa, diferenças salariais, horas extras e outros direitos trabalhistas.',
        icon: 'pi-briefcase'
      },
      {
        reportType: 'Consumidor',
        title: 'Proteção ao Consumidor',
        description: 'Produtos defeituosos, compras não realizadas, cláusulas abusivas e direitos do consumidor.',
        icon: 'pi-shopping-cart'
      },
      {
        reportType: 'Família',
        title: 'Direito de Família',
        description: 'Guarda de filhos, pensão alimentícia, divórcio e questões familiares.',
        icon: 'pi-home'
      },
      {
        reportType: 'Imóvel',
        title: 'Direito Imobiliário',
        description: 'Disputas de propriedade, contratos de aluguel, compra e venda de imóveis.',
        icon: 'pi-building'
      },
      {
        reportType: 'Pessoa Física',
        title: 'Direitos Pessoais',
        description: 'Danos morais, indenizações por lesões corporais e violação de direitos pessoais.',
        icon: 'pi-user'
      },
      {
        reportType: 'Educação',
        title: 'Direito Educacional',
        description: 'Questões educacionais, matrículas, bolsas de estudo e direitos estudantis.',
        icon: 'pi-book'
      }
    ];
  }

  private setupIntersectionObserver(): void {
    if (!this.counterElement) return;

    const options = {
      root: null, // viewport
      rootMargin: '0px 0px -100px 0px', // trigger when element is 100px before entering viewport
      threshold: 0.1 // trigger when 10% of element is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startCounter();
        }
      });
    }, options);

    observer.observe(this.counterElement.nativeElement);
  }

  startCounter(): void {
    if (this.hasCounted) {
      this.resetCounter();
    }

    const increment = Math.ceil(this.targetCount / (3000 / this.countingSpeed)); // 3 seconds total animation

    const timer = setInterval(() => {
      this.currentCount += increment;

      if (this.currentCount >= this.targetCount) {
        this.currentCount = this.targetCount;
        this.hasCounted = true;
        clearInterval(timer);
      }

      this.updateCounterDisplay();
    }, this.countingSpeed);
  }

  private resetCounter(): void {
    this.currentCount = 0;
    this.hasCounted = false;
  }

  private updateCounterDisplay(): void {
    if (this.counterElement) {
      this.counterElement.nativeElement.textContent = `Mais de ${this.currentCount.toLocaleString()} famílias atendidas`;
    }
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

  // Análise de problema methods
  analyzeProblem(): void {
    if (!this.problemDescription.trim()) {
      return;
    }

    this.isAnalyzing = true;
    this.startLoadingSimulation();
  }

  startLoadingSimulation(): void {
    this.loadingProgress = 0;
    this.analysisTimer = setInterval(() => {
      this.loadingProgress += Math.random() * 15 + 5; // Progresso entre 5-20%

      if (this.loadingProgress >= 100) {
        this.loadingProgress = 100;
        this.completeAnalysis();
        clearInterval(this.analysisTimer);
      }
    }, 200);
  }

  completeAnalysis(): void {
    this.isAnalyzing = false;
    this.showAnalysis = false;
    this.showRegistration = true;

    // Gera um valor simulado entre R$ 5.000,00 e R$ 50.000,00
    this.potentialAmount = Math.floor(Math.random() * 4500000) + 500000; // centavos
    this.potentialAmount = this.potentialAmount / 100; // converte para reais com centavos
  }

  resetAnalysis(): void {
    this.problemDescription = '';
    this.isAnalyzing = false;
    this.showAnalysis = false;
    this.showRegistration = false;
    this.loadingProgress = 0;
    this.potentialAmount = 0;
    if (this.analysisTimer) {
      clearInterval(this.analysisTimer);
    }
  }

  formatCurrency(value: number): string {
    return 'R$ ' + value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // Toggle methods
  setAnalysisMode(): void {
    this.showHelpMode = false;
    this.resetAnalysis();
  }

  setHelpMode(): void {
    this.showHelpMode = true;
    this.resetAnalysis();
  }
}
