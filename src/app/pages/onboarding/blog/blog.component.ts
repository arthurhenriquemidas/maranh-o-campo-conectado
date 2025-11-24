import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface MenuItem {
  label: string;
  action?: () => void;
  routerLink?: string;
  icon?: string;
  children?: MenuItem[];
}

export interface BlogArticle {
  id: number;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string;
  autor: string;
  data: string;
  imagem: string;
  destaques: string[];
  tempoLeitura: string;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  menuItems: MenuItem[] = [];
  activeMenuItem: string = 'Blog';

  // Blog data
  artigos: BlogArticle[] = [
    {
      id: 1,
      titulo: 'Novas regras para divórcio facilitam processos',
      resumo: 'Mudanças na legislação simplificam procedimentos de divórcio, tornando o processo mais ágil e menos burocrático.',
      conteudo: `
        <p>As recentes mudanças na legislação civil brasileira trouxeram importantes simplificações para o processo de divórcio. O objetivo é tornar o procedimento mais ágil e menos traumático para as partes envolvidas.</p>

        <h3>Principais Mudanças:</h3>
        <ul>
          <li><strong>Divórcio imediato:</strong> Não é mais necessário aguardar período de separação</li>
          <li><strong>Partilha de bens:</strong> Processo simplificado para bens comuns</li>
          <li><strong>Guarda dos filhos:</strong> Prioriza o bem-estar da criança</li>
          <li><strong>Pensão alimentícia:</strong> Cálculo baseado na necessidade real</li>
        </ul>

        <p>Essas alterações representam um avanço significativo na legislação familiar, permitindo que as famílias resolvam suas questões de forma mais rápida e menos conflituosa.</p>

        <blockquote>
          "A simplificação do divórcio não significa desvalorizar o casamento, mas reconhecer que quando ele não funciona, deve terminar de forma digna e rápida."
        </blockquote>
      `,
      categoria: 'Direito Civil',
      autor: 'Dra. Maria Silva',
      data: '15 de Outubro, 2024',
      imagem: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      destaques: ['Simplificação', 'Agilidade', 'Bem-estar'],
      tempoLeitura: '5 min'
    },
    {
      id: 2,
      titulo: 'Proteções trabalhistas são ampliadas',
      resumo: 'Novas medidas garantem mais direitos aos trabalhadores, incluindo home office e proteção contra demissões.',
      conteudo: `
        <p>O mercado de trabalho brasileiro passa por transformações significativas com as recentes alterações na legislação trabalhista. As mudanças visam proteger os trabalhadores em um cenário de constante evolução tecnológica e novos modelos de trabalho.</p>

        <h3>Principais Proteções:</h3>
        <ul>
          <li><strong>Home Office:</strong> Regulamentação do trabalho remoto</li>
          <li><strong>Demissões:</strong> Proteções contra dispensas arbitrárias</li>
          <li><strong>Benefícios:</strong> Extensão de direitos para trabalhadores informais</li>
          <li><strong>Saúde Mental:</strong> Reconhecimento como questão trabalhista</li>
        </ul>

        <p>Estas medidas representam um avanço importante na proteção dos direitos dos trabalhadores brasileiros, especialmente em um contexto de transformação digital acelerada.</p>
      `,
      categoria: 'Direito do Trabalho',
      autor: 'Dr. João Santos',
      data: '12 de Outubro, 2024',
      imagem: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      destaques: ['Trabalho Remoto', 'Proteção', 'Inovação'],
      tempoLeitura: '7 min'
    },
    {
      id: 3,
      titulo: 'LGPD: Empresas devem se adequar até dezembro',
      resumo: 'Prazo final para adequação à Lei Geral de Proteção de Dados se aproxima. Saiba como se preparar.',
      conteudo: `
        <p>A Lei Geral de Proteção de Dados (LGPD) estabeleceu um marco regulatório para o tratamento de dados pessoais no Brasil. Com o prazo final se aproximando, as empresas precisam acelerar seus processos de adequação.</p>

        <h3>Etapas para Adequação:</h3>
        <ol>
          <li><strong>Mapeamento de dados:</strong> Identificar todos os dados pessoais tratados</li>
          <li><strong>Nomeação do DPO:</strong> Designar um encarregado de dados</li>
          <li><strong>Revisão de processos:</strong> Adaptar procedimentos internos</li>
          <li><strong>Treinamento:</strong> Capacitar colaboradores</li>
          <li><strong>Documentação:</strong> Criar políticas e procedimentos</li>
        </ol>

        <p>A multa por descumprimento pode chegar a R$ 50 milhões por infração, tornando essencial a conformidade com a legislação.</p>
      `,
      categoria: 'Direito Digital',
      autor: 'Dra. Ana Costa',
      data: '8 de Outubro, 2024',
      imagem: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      destaques: ['LGPD', 'Proteção de Dados', 'Multas'],
      tempoLeitura: '8 min'
    },
    {
      id: 4,
      titulo: 'Startups ganham incentivos fiscais em nova legislação',
      resumo: 'Medidas aprovadas pelo Congresso facilitam abertura e operação de empresas inovadoras com benefícios tributários.',
      conteudo: `
        <p>O ecossistema de inovação brasileiro recebe um importante impulso com a aprovação da nova legislação que oferece incentivos fiscais para startups e empresas de base tecnológica.</p>

        <h3>Benefícios Incluem:</h3>
        <ul>
          <li><strong>Redução de impostos:</strong> Até 50% de desconto no IRPJ</li>
          <li><strong>Simplificação:</strong> Processo de abertura facilitado</li>
          <li><strong>Investimento:</strong> Incentivos para investidores-anjo</li>
          <li><strong>Inovação:</strong> Dedução de gastos com P&D</li>
        </ul>

        <p>Estas medidas têm o potencial de transformar o cenário empreendedor brasileiro, facilitando o nascimento e crescimento de empresas inovadoras.</p>
      `,
      categoria: 'Direito Empresarial',
      autor: 'Dr. Carlos Oliveira',
      data: '5 de Outubro, 2024',
      imagem: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      destaques: ['Startups', 'Incentivos', 'Inovação'],
      tempoLeitura: '6 min'
    },
    {
      id: 5,
      titulo: 'Reforma tributária: impactos no setor jurídico',
      resumo: 'Análise das mudanças propostas na reforma tributária e seus efeitos na prática jurídica.',
      conteudo: `
        <p>A reforma tributária proposta representa a maior mudança no sistema tributário brasileiro desde a Constituição de 1988. Suas implicações para o setor jurídico são significativas e merecem atenção especial.</p>

        <h3>Principais Impactos:</h3>
        <ul>
          <li><strong>Unificação de tributos:</strong> Simplificação da carga tributária</li>
          <li><strong>Alteração de alíquotas:</strong> Mudanças nos cálculos de impostos</li>
          <li><strong>Novos procedimentos:</strong> Adaptação aos novos sistemas</li>
          <li><strong>Oportunidades:</strong> Novos nichos de atuação para advogados</li>
        </ul>

        <p>Os profissionais do direito precisam se preparar para as mudanças que entrarão em vigor nos próximos anos.</p>
      `,
      categoria: 'Direito Tributário',
      autor: 'Dr. Roberto Lima',
      data: '2 de Outubro, 2024',
      imagem: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      destaques: ['Reforma Tributária', 'Impactos', 'Oportunidades'],
      tempoLeitura: '9 min'
    },
    {
      id: 6,
      titulo: 'Inteligência Artificial e Direito: o futuro da advocacia',
      resumo: 'Como a IA está transformando a prática jurídica e quais as implicações éticas dessa revolução tecnológica.',
      conteudo: `
        <p>A Inteligência Artificial está revolucionando diversos setores, e o direito não fica de fora dessa transformação. Ferramentas de IA estão mudando a forma como advogados pesquisam, analisam documentos e tomam decisões.</p>

        <h3>Aplicações da IA no Direito:</h3>
        <ul>
          <li><strong>Análise de contratos:</strong> Identificação automática de cláusulas problemáticas</li>
          <li><strong>Pesquisa jurisprudencial:</strong> Busca inteligente de precedentes</li>
          <li><strong>Previsão de resultados:</strong> Análise preditiva de processos</li>
          <li><strong>Automatização de documentos:</strong> Geração automática de petições</li>
        </ul>

        <p>No entanto, essa transformação levanta importantes questões éticas sobre o papel do advogado e a responsabilidade pela tomada de decisões.</p>
      `,
      categoria: 'Direito Digital',
      autor: 'Dra. Sofia Chen',
      data: '28 de Setembro, 2024',
      imagem: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      destaques: ['Inteligência Artificial', 'Tecnologia', 'Ética'],
      tempoLeitura: '10 min'
    }
  ];

  artigosFiltrados: BlogArticle[] = [];
  categorias: string[] = [];
  categoriaSelecionada: string = '';
  buscaTexto: string = '';

  // Modal state
  artigoSelecionado: BlogArticle | null = null;

  constructor(private router: Router) {
    this.initializeMenu();
    this.artigosFiltrados = [...this.artigos];
    this.categorias = [...new Set(this.artigos.map(a => a.categoria))];
  }

  ngOnInit() {
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

  filtrarPorCategoria(categoria: string): void {
    this.categoriaSelecionada = categoria;
    this.aplicarFiltros();
  }

  filtrarPorBusca(): void {
    this.aplicarFiltros();
  }

  private aplicarFiltros(): void {
    let filtrados = [...this.artigos];

    // Filtro por categoria
    if (this.categoriaSelecionada) {
      filtrados = filtrados.filter(artigo => artigo.categoria === this.categoriaSelecionada);
    }

    // Filtro por busca
    if (this.buscaTexto.trim()) {
      const termo = this.buscaTexto.toLowerCase().trim();
      filtrados = filtrados.filter(artigo =>
        artigo.titulo.toLowerCase().includes(termo) ||
        artigo.resumo.toLowerCase().includes(termo) ||
        artigo.conteudo.toLowerCase().includes(termo) ||
        artigo.autor.toLowerCase().includes(termo)
      );
    }

    this.artigosFiltrados = filtrados;
  }

  limparFiltros(): void {
    this.categoriaSelecionada = '';
    this.buscaTexto = '';
    this.artigosFiltrados = [...this.artigos];
  }

  getArtigosDestaque(): BlogArticle[] {
    return this.artigos.slice(0, 3);
  }

  getArtigosRecentes(): BlogArticle[] {
    return this.artigos.slice(3);
  }

  expandirArtigo(artigo: BlogArticle): void {
    this.artigoSelecionado = artigo;
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  fecharArtigo(): void {
    this.artigoSelecionado = null;
    document.body.style.overflow = 'auto'; // Restore scroll
  }
}
