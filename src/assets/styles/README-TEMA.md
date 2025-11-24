# ⚖️ Tema Jurídico Light - Cores Pastéis Profissionais

## ✅ **Status: Implementado e Ativo**

O tema personalizado foi **importado e configurado** no projeto. Todas as personalizações estão ativas automaticamente.

## 📁 **Arquivos do Tema**

- `theme-custom.css` - Tema principal (já importado em `styles.scss`)
- `theme-demo.html` - Demonstração visual dos componentes
- Este README com instruções

## 🚀 **Como Usar**

### **1. Tema Já Ativo**
O tema está **automaticamente ativo** em todo o projeto através da importação em `src/styles.scss`.

### **2. Densidade Compacta (Opcional)**
Para ativar a densidade compacta, adicione a classe no `app.component.ts`:

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {
    '[class.is-compact]': 'isCompactMode'
  }
})
export class AppComponent implements OnInit {
  isCompactMode = false; // Altere para true para densidade compacta

  toggleCompactMode() {
    this.isCompactMode = !this.isCompactMode;
  }
}
```

### **3. Tema Light Exclusivo**
O tema utiliza **apenas modo claro** com cores pastéis suaves e profissionais, otimizado para o ambiente jurídico.

## 🎯 **Recursos Implementados**

### **✅ Componentes Estilizados**
- ✅ Botões (todos os tipos e tamanhos)
- ✅ Inputs (text, password, dropdown, multiselect, calendar)
- ✅ Tabelas (DataTable com paginação)
- ✅ Cards e Panels
- ✅ Menus e Navegação
- ✅ Tabs e Steps
- ✅ Messages e Toasts
- ✅ Dialogs e Overlays
- ✅ Badges, Chips e Tags
- ✅ Progress e Skeleton
- ✅ Tooltips
- ✅ Checkbox e Radio

### **✅ Estados e Interações**
- ✅ Hover effects elegantes
- ✅ Focus visible para acessibilidade
- ✅ Estados disabled claros
- ✅ Validação (erro, sucesso, aviso)
- ✅ Loading states

### **✅ Acessibilidade WCAG AA**
- ✅ Contraste adequado
- ✅ Foco sempre visível
- ✅ Tamanhos de toque mínimos (44px)
- ✅ Suporte a leitores de tela
- ✅ Navegação por teclado

### **✅ Responsividade**
- ✅ Mobile-first design
- ✅ Breakpoints otimizados
- ✅ Touch-friendly
- ✅ RTL support

## 🎨 **Paleta de Cores**

### **Cores Principais (Pastéis)**
- **Primary**: `var(--primary-600)` (azul esverdeado)
- **Accent**: `#10b981` (verde esmeralda suave)
- **Secondary**: `#8b5cf6` (lavanda)

### **Cores Semânticas (Suaves)**
- **Success**: `#10b981` (verde suave)
- **Warning**: `#f59e0b` (âmbar)
- **Danger**: `#f87171` (coral suave)
- **Info**: `#60a5fa` (azul céu)

### **Superfícies (Light Pastéis)**
- **Surface 0**: `#ffffff` (branco puro)
- **Surface 50**: `#fafbfc` (background principal)
- **Surface 100**: `#f3f4f6` (hover states suaves)

## 🔧 **Personalização**

### **Modificar Cores**
Edite as variáveis CSS em `theme-custom.css`:

```css
:root {
  --brand-primary: #sua-cor-aqui;
  --brand-accent: #sua-cor-aqui;
  /* ... outras variáveis */
}
```

### **Modificar Espaçamentos**
```css
:root {
  --space-4: 16px; /* Espaçamento padrão */
  --space-5: 24px; /* Espaçamento médio */
  /* ... outros espaçamentos */
}
```

### **Modificar Tipografia**
```css
:root {
  --font-family: 'Sua-Font', Inter, sans-serif;
  --font-size-base: 14.5px;
  /* ... outras propriedades */
}
```

## 🧪 **Teste Visual**

Abra o arquivo `theme-demo.html` no navegador para ver todos os componentes estilizados:

```bash
# Navegue até a pasta
cd src/assets/styles/

# Abra no navegador (Windows)
start theme-demo.html

# Ou abra manualmente o arquivo theme-demo.html
```

## 📱 **Recursos Especiais**

### **Modo Compacto**
- Reduz espaçamentos em 25%
- Ideal para dashboards com muita informação
- Ativa com classe `is-compact` no HTML

### **Paleta Pastel Exclusiva**
- Cores suaves e profissionais
- Tons pastéis que transmitem confiança
- Contraste otimizado para leitura prolongada

### **Reduced Motion**
- Respeita `prefers-reduced-motion: reduce`
- Remove animações para usuários sensíveis
- Melhora acessibilidade neurológica

### **High Contrast**
- Detecta `prefers-contrast: high`
- Aumenta contraste automaticamente
- Bordas mais espessas para melhor visibilidade

## 🚨 **Importante**

### **Ordem de Importação**
Mantenha sempre esta ordem no `styles.scss`:

```scss
// 1. Tema base PrimeNG
@import '../node_modules/primeng/resources/themes/saga-blue/theme.css';
@import '../node_modules/primeng/resources/primeng.css';

// 2. Tema personalizado (APÓS o base)
@import 'assets/styles/theme-custom.css';
```

### **Não Modificar**
- Não edite os arquivos base do PrimeNG
- Todas as personalizações devem ir no `theme-custom.css`
- Use as variáveis CSS para mudanças consistentes

## 🎯 **Próximos Passos**

1. **Teste** todos os componentes na sua aplicação
2. **Ajuste** cores se necessário nas variáveis CSS
3. **Ative** densidade compacta se preferir
4. **Reporte** qualquer problema encontrado

## 📞 **Suporte**

Se encontrar algum problema ou precisar de ajustes:

1. Verifique a ordem de importação no `styles.scss`
2. Teste com o `theme-demo.html`
3. Consulte as variáveis CSS disponíveis
4. Verifique se o build está funcionando corretamente

---

**🌸 Tema light com cores pastéis desenvolvido para elegância e profissionalismo jurídico!**
