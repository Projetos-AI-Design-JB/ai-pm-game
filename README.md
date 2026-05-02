# 🚀 AI Product Manager: Business Game

Bem-vindo ao repositório do **AI Product Manager Simulator** (GlobalBev). Este é um simulador interativo desenvolvido para treinar e desafiar as habilidades de tomada de decisão em gestão de ciclo de vida de produtos de Inteligência Artificial para o mercado B2B.

## 🎯 Sobre o Projeto

Liderar produtos de IA vai muito além de "escolher o melhor LLM". O simulador coloca o usuário no papel de um *Head of AI Product* gerenciando o assistente virtual "SmartBev" em um grande e-commerce B2B. Você enfrentará **12 Cenários Críticos** divididos nas seguintes fases:

1. **Estratégia e Dados:** Dilemas de IP, Treinamento, LGPD e Precificação.
2. **Engenharia:** "Build vs Buy", escolha de infraestrutura de Banco Vetorial (RAG) e mitigação de latência.
3. **Cultura e Stakeholders:** Gerenciamento de greves, pitch C-Level e SLAs.
4. **Operações e Crises:** Controle de custos de nuvem (OpEx), Injeções de Prompt e gerenciamento de Alucinações na Black Friday.

Cada "run" (partida) no jogo **sorteia dinamicamente 1 cenário por fase**, criando dezenas de ramificações e alto *Replay Value*. O veredito final avalia o seu sucesso ou falência baseado em Caixa, Acurácia, Time-to-Market e Risco Corporativo.

## 🛠️ Stack Tecnológica

O projeto foi construído utilizando as melhores práticas do ecossistema React moderno:

- **Framework:** [Next.js 14+](https://nextjs.org/) (App Router)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Gráficos e Dashboards:** [Chart.js](https://www.chartjs.org/) / react-chartjs-2
- **Ícones:** React Icons (Feather Icons)
- **Linguagem:** TypeScript

## 📂 Estrutura Relevante

```bash
  /src-app
    /ai-pm-game       # Rota principal do Simulador
      layout.tsx      # Configuração de SEO e Metadata da rota
      page.tsx        # Motor de cenários, lógicas matemáticas e UI
```

## 🚀 Como Executar Localmente

1. Clone o repositório.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse o simulador através do navegador:
   `http://localhost:3000/ai-pm-game`

---
*Desenvolvido por JB*
