'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiArrowLeft,
  FiDollarSign,
  FiClock,
  FiShield,
  FiBriefcase,
  FiTrendingUp,
  FiTarget,
  FiActivity,
  FiDatabase,
  FiUsers,
  FiLock,
  FiCpu,
  FiAlertCircle
} from 'react-icons/fi';

// --- TYPES ---
type ScenarioOption = {
  id: string;
  label: string;
  desc: string;
  impacts: { budget: number; time: number; accuracy: number; compliance: number };
};

type Scenario = {
  id: string;
  title: string;
  context: string;
  icon: any;
  options: ScenarioOption[];
};

// --- DATA: 12 SCENARIOS OVER 4 PHASES ---
const PHASES = [
  {
    phaseId: 1,
    title: "FASE 1: ESTRATÉGIA, FUNDAÇÕES E DADOS",
    scenarios: [
      {
        id: '1.1',
        title: 'O Dilema dos Dados de Treinamento e IP',
        context: 'Para aumentar a acurácia do RAG do seu assistente B2B, o time solicitou uma base maior. O histórico interno está sujo. Existem bases de mercado riquíssimas sendo vendidas, mas com zonas cinzentas de Direitos Autorais (IP).',
        icon: FiDatabase,
        options: [
          { id: '1.1A', label: 'Base Interna Suja', desc: 'Forçar o uso dos dados legados. Acurácia Moderada (herda vieses). Zero Risco Legal. TTM Atrasado.', impacts: { budget: -30, time: -1, accuracy: 0, compliance: +20 } },
          { id: '1.1B', label: 'Dataset Terceirizado', desc: 'Comprar um dataset premium por US$ 100K. TTM Imediato. Acurácia Excelente. Risco Legal alto.', impacts: { budget: -100, time: 0, accuracy: +30, compliance: -30 } },
          { id: '1.1C', label: 'Dados Sintéticos (LLM Maior)', desc: 'Pagar API GPT-4 para gerar milhares de conversas perfeitas. TTM Rápido. Risco de Model Collapse.', impacts: { budget: -50, time: +1, accuracy: +15, compliance: 0 } }
        ]
      },
      {
        id: '1.2',
        title: 'Conformidade Regulatória (LGPD / AI Act)',
        context: 'O Jurídico barrou o lançamento. Eles notaram que usuários B2B digitam dados sensíveis (PII) nos prompts que são processados na nuvem. Há sério risco de infração da LGPD.',
        icon: FiShield,
        options: [
          { id: '1.2A', label: 'Termos de Consentimento (Opt-in)', desc: 'Forçar um pop-up jurídico. Custo zero, mas UX e Adoção caem. Risco Jurídico alto em vazamentos.', impacts: { budget: 0, time: 0, accuracy: -10, compliance: -40 } },
          { id: '1.2B', label: 'Edge Masking (Middleware)', desc: 'Substitui nomes e CNPJs por tokens antes de enviar ao LLM. CapEx Alto. Risco Legal cai para zero.', impacts: { budget: -80, time: -1, accuracy: -5, compliance: +40 } },
          { id: '1.2C', label: 'Soberania On-Premise', desc: 'Hospedar modelo Open-Source em data center físico air-gapped. CapEx Astronômico, TTM Atrasado.', impacts: { budget: -250, time: -4, accuracy: 0, compliance: +60 } }
        ]
      },
      {
        id: '1.3',
        title: 'Estratégia de Monetização e Precificação',
        context: 'A IA custa dinheiro por cada requisição. Como AI PM, você precisa definir como o modelo de negócio vai absorver esse custo sem afugentar a base de 100.000 clientes.',
        icon: FiDollarSign,
        options: [
          { id: '1.3A', label: 'Pay-per-Token (Repasse)', desc: 'Cliente B2B paga pelo volume exato. Risco Financeiro Zero. Atrito altíssimo de adoção.', impacts: { budget: +50, time: 0, accuracy: -20, compliance: +10 } },
          { id: '1.3B', label: 'Assinatura Premium (Flat Fee)', desc: 'Cobrar US$ 50/mês para uso ilimitado. Adoção excelente. Risco de margem negativa (heavy users).', impacts: { budget: -150, time: 0, accuracy: +20, compliance: 0 } },
          { id: '1.3C', label: 'Freemium Subsidiado (Hard Limits)', desc: 'Grátis limitado a 10 interações/dia. Explosão de adoção, ROI indireto. Frustração no limite diário.', impacts: { budget: -50, time: 0, accuracy: +10, compliance: -10 } }
        ]
      }
    ]
  },
  {
    phaseId: 2,
    title: "FASE 2: ENGENHARIA E ARQUITETURA",
    scenarios: [
      {
        id: '2.1',
        title: 'O Motim da Engenharia (Build vs Buy)',
        context: 'Seu Tech Lead ameaça pedir demissão. Ele recusa integrar uma API "caixa-preta" e quer montar um time de MLOps para treinar um modelo do zero para evitar Vendor Lock-in.',
        icon: FiCpu,
        options: [
          { id: '2.1A', label: 'Comprar a Visão (Full Custom)', desc: 'Construir modelo próprio. Retém talentos. TTM Atrasado 6 meses. Alto CapEx. Risco de falha técnica.', impacts: { budget: -200, time: -6, accuracy: -10, compliance: +30 } },
          { id: '2.1B', label: 'Vetar e Impor SaaS (API)', desc: 'Forçar integração API. TTM imediato, OpEx altíssimo. Moral da equipe despenca. Dependência total.', impacts: { budget: -50, time: 0, accuracy: +20, compliance: -30 } },
          { id: '2.1C', label: 'Arquitetura Híbrida / Abstrata', desc: 'Usa API agora, mas aloca 30% da engenharia para criar um roteador agnóstico. Custo duplo temporário.', impacts: { budget: -100, time: -2, accuracy: +10, compliance: +10 } }
        ]
      },
      {
        id: '2.2',
        title: 'O Dilema da Latência vs Contexto (UX)',
        context: 'Em Alpha, o assistente acerta tudo mas demora 18s para responder (lê 50 páginas de PDF a cada prompt). Lojistas estão abandonando achando que travou.',
        icon: FiClock,
        options: [
          { id: '2.2A', label: 'Compressão Agressiva de Contexto', desc: 'Reduz RAG e usa modelo Mini. Latência 2s, UX fluida. Acurácia despenca em perguntas complexas.', impacts: { budget: +50, time: 0, accuracy: -40, compliance: 0 } },
          { id: '2.2B', label: 'Ilusão de Performance (Streaming)', desc: 'Mantém IA pesada, foca em Streaming UI e placeholders. Acurácia garantida, custo continua alto.', impacts: { budget: -40, time: 0, accuracy: +20, compliance: 0 } },
          { id: '2.2C', label: 'Cache Semântico', desc: 'Respostas prontas para perguntas parecidas. Requer +1 Mês de Engenharia. Risco de dados desatualizados.', impacts: { budget: -60, time: -1, accuracy: +10, compliance: -10 } }
        ]
      },
      {
        id: '2.3',
        title: 'Decisão de Infraestrutura RAG',
        context: 'O projeto precisa escalar para suportar 5 milhões de vetores. É necessário definir o Banco de Dados Vetorial.',
        icon: FiDatabase,
        options: [
          { id: '2.3A', label: 'SaaS Gerenciado (ex: Pinecone)', desc: 'Serverless, escala infinita sem esforço. OpEx mensal dolarizado e altíssimo.', impacts: { budget: -120, time: 0, accuracy: +10, compliance: 0 } },
          { id: '2.3B', label: 'DB Tradicional (pgvector)', desc: 'Usa a infra que já possui. OpEx quase zero. Trabalho pesado, performance média, risco no ERP.', impacts: { budget: 0, time: -2, accuracy: -10, compliance: -20 } },
          { id: '2.3C', label: 'Self-Hosted (ex: Milvus)', desc: 'Performance excelente, OpEx baixo, mas exige DevOps dedicado (Aumento de folha CapEx humano).', impacts: { budget: -80, time: -1, accuracy: +20, compliance: 0 } }
        ]
      }
    ]
  },
  {
    phaseId: 3,
    title: "FASE 3: CULTURA E STAKEHOLDERS",
    scenarios: [
      {
        id: '3.1',
        title: 'Pânico no Call Center B2B',
        context: 'Vazou que a IA pode automatizar 60% das tarefas. A produtividade caiu e o sindicato dos atendentes ameaça greve temendo demissões em massa.',
        icon: FiUsers,
        options: [
          { id: '3.1A', label: 'Automação Agressiva (Rip & Replace)', desc: 'Iniciar cortes imediatamente para fechar a conta do projeto. Crise de Relações Públicas severa.', impacts: { budget: +150, time: 0, accuracy: -15, compliance: -50 } },
          { id: '3.1B', label: 'Pivotar para Copiloto Interno', desc: 'Lançar apenas para os atendentes (Human-in-the-loop). Acurácia de 100%. Custos dobrados.', impacts: { budget: -150, time: +1, accuracy: +40, compliance: +40 } },
          { id: '3.1C', label: 'Gamificação de Transição (Re-skilling)', desc: 'Bônus para humanos que treinam a IA. Lançamento suave, porém custos de treinamento altíssimos.', impacts: { budget: -80, time: -2, accuracy: +20, compliance: +20 } }
        ]
      },
      {
        id: '3.2',
        title: 'O Pitch Decisivo de Financiamento',
        context: 'Você tem 15 minutos com a Diretoria para conseguir US$ 2 Milhões e escalar o projeto para o país inteiro. Qual a narrativa estratégica?',
        icon: FiTarget,
        options: [
          { id: '3.2A', label: 'Redução de Custos (Alvo: CFO)', desc: 'Prometer cortes de headcount. Aprovação alta. O produto vira refém financeiro, inovações são barradas.', impacts: { budget: +250, time: 0, accuracy: -10, compliance: -20 } },
          { id: '3.2B', label: 'Aumento de Receita (Alvo: Vendas)', desc: 'IA fará cross-sell. Escopo muda para Agente de Vendas. Integração complexa de CRM, TTM sobe.', impacts: { budget: +150, time: -3, accuracy: +10, compliance: 0 } },
          { id: '3.2C', label: 'Data Moat (Alvo: CEO)', desc: 'Vender disrupção. CEO libera orçamento por FOMO. Pressão forte por "Teatro de Inovação" midiático.', impacts: { budget: +100, time: 0, accuracy: +5, compliance: -10 } }
        ]
      },
      {
        id: '3.3',
        title: 'Gerenciamento de Expectativas B2B',
        context: 'Grandes contas exigem "0% de erro nas respostas". Em IA Generativa isso é impossível devido à natureza probabilística. Como lidar com os contratos?',
        icon: FiBriefcase,
        options: [
          { id: '3.3A', label: 'SLA com Transbordo Oculto', desc: 'Respostas de baixa confiança vão secretamente para humanos na Índia. Cumpre SLA. OpEx caríssimo.', impacts: { budget: -200, time: 0, accuracy: +30, compliance: 0 } },
          { id: '3.3B', label: 'Transparência Absoluta (Beta)', desc: 'Avisos enormes de que a IA erra. Protege legalmente a empresa, mas causa desconfiança no mercado.', impacts: { budget: 0, time: 0, accuracy: -15, compliance: +20 } },
          { id: '3.3C', label: 'Castração de Features', desc: 'Usar NLP simples (botões) e zero geração. 100% Seguro. Risco zero. Mata o ROI revolucionário.', impacts: { budget: -20, time: +1, accuracy: -30, compliance: +30 } }
        ]
      }
    ]
  },
  {
    phaseId: 4,
    title: "FASE 4: OPERAÇÃO E CRISES",
    scenarios: [
      {
        id: '4.1',
        title: 'Choque do Custo de Nuvem (OpEx)',
        context: 'Sucesso absoluto de uso! Mas o limite do cartão estourou no dia 20 do mês. O serviço vai cair se você não agir agora.',
        icon: FiActivity,
        options: [
          { id: '4.1A', label: 'Rate Limiting Imediato', desc: 'Limite estrito de 5 mensagens/dia por cliente B2B. Salva o budget. CSAT afunda e gera revolta.', impacts: { budget: +100, time: 0, accuracy: -30, compliance: -20 } },
          { id: '4.1B', label: 'Força-Tarefa de Prompt Compression', desc: 'Pausa o roadmap por 3 semanas para otimizar tokens. Conta reduz pela metade. Leve queda na nuance.', impacts: { budget: +60, time: -1, accuracy: -10, compliance: 0 } },
          { id: '4.1C', label: 'Desligar Memória do Agente', desc: 'A IA perde o histórico de chat e recebe prompts "limpos". Economia maciça, UX e CSAT destruídos.', impacts: { budget: +150, time: 0, accuracy: -50, compliance: -30 } }
        ]
      },
      {
        id: '4.2',
        title: 'Alucinação na Black Friday',
        context: 'Devido a um PDF antigo no RAG, o bot ofereceu 80% de desconto e pallets grátis. Clientes tiraram prints e exigem entrega. Prejuízo: US$ 250K.',
        icon: FiAlertCircle,
        options: [
          { id: '4.2A', label: 'Acionar Kill-Switch (Desligar IA)', desc: 'Desliga tudo e volta pra fila humana. SLA vai a 4 dias. Reputação tecnológica da empresa é morta.', impacts: { budget: 0, time: 0, accuracy: -40, compliance: -50 } },
          { id: '4.2B', label: 'Patch de Hard Prompt', desc: 'Ordem travando qualquer papo de desconto. IA vira um robô inútil e frustra usuários no pior dia.', impacts: { budget: 0, time: 0, accuracy: -30, compliance: -20 } },
          { id: '4.2C', label: 'Honrar o Erro (Pivô Ético)', desc: 'Pagar os US$ 250K para não perder a relação B2B e fazer rollback de banco. Lealdade absurda da base.', impacts: { budget: -250, time: 0, accuracy: +10, compliance: +60 } }
        ]
      },
      {
        id: '4.3',
        title: 'Ataque de Prompt Injection',
        context: 'Um concorrente injetou comandos e forçou a IA a cuspir na tela a tabela secreta de margens de lucro que estava no contexto sistêmico.',
        icon: FiLock,
        options: [
          { id: '4.3A', label: 'LLM Firewall (Guardrails Layer)', desc: 'Usa um LLM menor apenas para julgar injeção. Dobra a latência normal e aumenta custos. Bloqueia quase tudo.', impacts: { budget: -60, time: 0, accuracy: -15, compliance: +40 } },
          { id: '4.3B', label: 'Regras de Regex (Filtros base)', desc: 'Bloqueia palavras proibidas. Barato e rápido. Alto risco de falsos positivos (clientes legítimos banidos).', impacts: { budget: 0, time: 0, accuracy: -30, compliance: -20 } },
          { id: '4.3C', label: 'Refactoring e Separação de Dados', desc: 'A IA nunca mais recebe a tabela inteira, faz uma API externa para checar limite. Solução definitiva, CapEx alto.', impacts: { budget: -150, time: -3, accuracy: +10, compliance: +50 } }
        ]
      }
    ]
  }
];

const INITIAL_BUDGET = 600; // $K
const INITIAL_TIME = 18; // months
const INITIAL_ACCURACY = 60; // %
const INITIAL_COMPLIANCE = 60; // %

type GameState = {
  view: 'intro' | 'playing' | 'results' | 'quick_cases';
  currentPhaseIndex: number;
  activeScenarios: Scenario[];
  budget: number;
  time: number;
  accuracy: number;
  compliance: number;
  history: Array<{ scenario: Scenario, option: ScenarioOption }>;
};

const QUICK_CASES = [
  {
    id: 1,
    title: 'O Dilema do Consultor Financeiro (Personalização em Escala)',
    businessProblem: 'Um consultor financeiro precisa traduzir rapidamente uma nova pesquisa de mercado em uma ideia de investimento validada e personalizada para um cliente com necessidades específicas e perfil de risco estrito.',
    architecture: 'RAG (Retrieval-Augmented Generation) com Arquitetura de Duplo Contexto.',
    dataSources: 'O modelo busca simultaneamente no banco vetorial 1 (Relatórios de Market Research aprovados pela corretora) e no banco vetorial 2 (CRM com o perfil de risco, liquidez e restrições do cliente).',
    ux: 'Interface de "Copiloto" (Human-in-the-loop). A IA gera o rascunho da tese de investimento, mas o envio ao cliente nunca é automatizado. O consultor deve revisar e aprovar (clique único).',
    tradeoff: 'Automação vs. Compliance (Risco Fiduciário). Se automatizar o envio (Agente Autônomo), ganha-se escala máxima, mas a corretora corre risco de processo na CVM/SEC se a IA alucinar uma recomendação fora do perfil de risco. A escolha certa é travar o produto no modo Copiloto.'
  },
  {
    id: 2,
    title: 'Síntese de Cenário Macro e Geopolítico',
    businessProblem: 'O consultor precisa redigir um relatório abrangente e bem fundamentado sobre um tópico político complexo e em alta (ex: novas tarifas de importação) que está impactando os mercados financeiros globais.',
    architecture: 'Agentes de Pesquisa Web Autônomos (Web-Search Agents) combinados com Prompting Estruturado.',
    dataSources: 'Conexão com APIs de notícias em tempo real (ex: Perplexity API, Bloomberg, Reuters) para evitar o "cutoff" (limite de data) dos modelos de linguagem padrão.',
    ux: 'O PM deve exigir que o output da IA utilize Citations (citações inline). Cada afirmação gerada pela IA deve vir com um link clicável para a fonte original da notícia.',
    tradeoff: 'Latência & OpEx vs. Viés de Informação. Usar múltiplos agentes para cruzar fontes e evitar fake news aumenta o custo da API (OpEx) e faz o relatório demorar minutos para ser gerado. Além disso, modelos de IA podem carregar vieses políticos embutidos em seus pesos, exigindo prompts rigorosos de neutralidade.'
  },
  {
    id: 3,
    title: 'O Desafio do E-commerce Multimodal',
    businessProblem: 'Uma gigante do varejo de moda quer gerar automaticamente descrições de produtos, tags de SEO e traduções locais (gírias regionais) para 50.000 novas peças de roupa por mês, possuindo apenas a foto do produto e a ficha técnica da fábrica (tecido e cor).',
    architecture: 'Pipeline Multimodal (Vision LLM + Fine-Tuning).',
    dataSources: 'Um modelo de visão (ex: GPT-4o ou Claude 3.5 Sonnet) analisa a foto para identificar o caimento e estilo, cruzando com a ficha técnica em texto.',
    ux: 'Processamento em lote (Batch Processing) no backend. A equipe de cadastro recebe os 50.000 SKUs preenchidos no ERP no dia seguinte.',
    tradeoff: 'OpEx (Custo de Visão) vs. Fine-Tuning. Rodar 50.000 imagens mensais em uma API de Visão comercial destruirá o orçamento (OpEx altíssimo). A solução de PM de elite é usar a API cara apenas para gerar um dataset de 2.000 peças perfeitas e usar isso para fazer o Fine-Tuning de um modelo open-source menor e mais barato rodando em infraestrutura própria.'
  },
  {
    id: 4,
    title: 'O Agente Autônomo na Saúde (Healthcare)',
    businessProblem: 'A administração de uma rede de hospitais quer reduzir o número de faltas (no-shows) em consultas. Eles querem uma IA que analise o histórico do paciente, preveja quem tem chance de faltar e inicie uma conversa no WhatsApp para reagendar ou confirmar a presença.',
    architecture: 'IA Preditiva (Machine Learning Clássico) acoplada a um Agente de IA Generativa.',
    dataSources: 'ERP Hospitalar (frequência passada, distância do paciente até o hospital, especialidade médica).',
    ux: 'O Agente usa a API do WhatsApp. Se o paciente disser "Não posso ir, meu carro quebrou", o Agente entende a intenção, acessa o banco de dados do calendário médico via API (Tool Calling) e oferece novos horários em tempo real.',
    tradeoff: 'Privacidade (LGPD/HIPAA) vs. Personalização. O paciente pode começar a mandar fotos de exames ou falar sobre sintomas graves no WhatsApp do robô de agendamento. O PM deve projetar Guardrails rígidos para a IA recusar diagnóstico médico e focar estritamente na agenda, além de garantir que dados sensíveis de saúde não sejam usados para treinar modelos de terceiros.'
  },
  {
    id: 5,
    title: 'Triagem de Recrutamento Tech (HR Tech)',
    businessProblem: 'O departamento de RH recebe 10.000 currículos para uma vaga de desenvolvedor. Eles querem uma IA para ler os PDFs, ranquear os 50 melhores e conduzir uma entrevista inicial por chat para testar a lógica do candidato antes de passar para um recrutador humano.',
    architecture: 'OCR para extrair texto -> RAG para comparar com a vaga -> Agente Conversacional (Chatbot).',
    dataSources: 'PDFs dos candidatos e repositório de perguntas técnicas da empresa.',
    ux: 'O candidato pré-selecionado recebe um link seguro para um chat cronometrado. A IA faz perguntas com base nas habilidades que o candidato alegou ter no currículo.',
    tradeoff: 'Viés Algorítmico e Risco Legal. Avaliar seres humanos via IA é considerado "Alto Risco" (EU AI Act). Se o modelo penalizar currículos de mulheres ou minorias porque foi treinado com dados históricos enviesados da própria empresa, a corporação sofrerá danos imensos à reputação. O PM deve priorizar auditoria de viés e não deixar a decisão de eliminação ser 100% automatizada.'
  }
];

const QuickCasesView = ({ onBack }: { onBack: () => void }) => {
  const [activeCase, setActiveCase] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.section key="quick_cases" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto">
      <button onClick={onBack} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <FiArrowLeft /> Voltar ao Menu
      </button>

      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-white mb-4">QUICK CASES <span className="text-blue-500">TRAINING</span></h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          O usuário lê o problema e precisa estruturar a solução (Arquitetura, UX e Risco) em poucos minutos. Treine seu raciocínio rápido.
        </p>
      </div>

      <div className="space-y-6">
        {QUICK_CASES.map((qcase, idx) => (
          <div key={qcase.id} className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden transition-all">
            <button 
              onClick={() => {
                setActiveCase(activeCase === qcase.id ? null : qcase.id);
                setRevealed(false);
              }}
              className="w-full text-left p-6 md:p-8 hover:bg-slate-800/50 transition-colors flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-black text-xl">
                  {idx + 1}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white pr-4">{qcase.title}</h3>
              </div>
              <FiArrowRight className={`text-slate-500 text-2xl transition-transform ${activeCase === qcase.id ? 'rotate-90 text-white' : ''}`} />
            </button>

            <AnimatePresence>
              {activeCase === qcase.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 md:px-8 pb-8"
                >
                  <div className="bg-slate-950/50 rounded-2xl p-6 md:p-8 border border-slate-800 mb-6">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Problema de Negócio</h4>
                    <p className="text-slate-200 text-lg md:text-xl leading-relaxed">{qcase.businessProblem}</p>
                  </div>

                  {!revealed ? (
                    <div className="flex justify-center py-6">
                      <button 
                        onClick={() => setRevealed(true)}
                        className="group bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 rounded-2xl transition-all scale-105 shadow-xl shadow-blue-500/20 flex items-center gap-2"
                      >
                        REVELAR SOLUÇÃO <FiBriefcase className="group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-widest mb-3">
                          <FiCpu /> Abordagem / Arquitetura
                        </h4>
                        <p className="text-slate-300 leading-relaxed font-medium">{qcase.architecture}</p>
                      </div>
                      
                      <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3">
                          <FiDatabase /> Fontes de Dados
                        </h4>
                        <p className="text-slate-300 leading-relaxed font-medium">{qcase.dataSources}</p>
                      </div>

                      <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-purple-400 uppercase tracking-widest mb-3">
                          <FiTarget /> UX / Execução
                        </h4>
                        <p className="text-slate-300 leading-relaxed font-medium">{qcase.ux}</p>
                      </div>

                      <div className="bg-rose-500/10 rounded-xl p-6 border border-rose-500/20">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-rose-400 uppercase tracking-widest mb-3">
                          <FiAlertCircle /> Trade-off Principal
                        </h4>
                        <p className="text-slate-300 leading-relaxed font-medium">{qcase.tradeoff}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default function AIPMGame() {
  const [state, setState] = useState<GameState>({
    view: 'intro',
    currentPhaseIndex: 0,
    activeScenarios: [],
    budget: INITIAL_BUDGET,
    time: INITIAL_TIME,
    accuracy: INITIAL_ACCURACY,
    compliance: INITIAL_COMPLIANCE,
    history: []
  });

  const startGame = () => {
    // Sorteia 1 cenário de cada fase
    const drawnScenarios = PHASES.map(phase => {
      const randomIdx = Math.floor(Math.random() * phase.scenarios.length);
      return phase.scenarios[randomIdx];
    });

    setState({
      view: 'playing',
      currentPhaseIndex: 0,
      activeScenarios: drawnScenarios,
      budget: INITIAL_BUDGET,
      time: INITIAL_TIME,
      accuracy: INITIAL_ACCURACY,
      compliance: INITIAL_COMPLIANCE,
      history: []
    });
  };

  const selectOption = (scenario: Scenario, option: ScenarioOption) => {
    const nextPhaseIndex = state.currentPhaseIndex + 1;
    const isFinished = nextPhaseIndex >= state.activeScenarios.length;

    setState(prev => ({
      ...prev,
      view: isFinished ? 'results' : 'playing',
      currentPhaseIndex: nextPhaseIndex,
      budget: prev.budget + option.impacts.budget,
      time: Math.max(0, prev.time + option.impacts.time),
      accuracy: Math.min(100, Math.max(0, prev.accuracy + option.impacts.accuracy)),
      compliance: Math.min(100, Math.max(0, prev.compliance + option.impacts.compliance)),
      history: [...prev.history, { scenario, option }]
    }));
  };

  // --- DERIVED STATE ---
  const currentScenario = state.activeScenarios[state.currentPhaseIndex];
  const currentPhaseDef = PHASES[state.currentPhaseIndex];

  const budgetStatus = useMemo(() => {
    if (state.budget >= 400) return 'text-emerald-400';
    if (state.budget >= 150) return 'text-amber-400';
    return 'text-rose-400';
  }, [state.budget]);

  const complianceStatus = useMemo(() => {
    if (state.compliance >= 80) return 'text-emerald-400';
    if (state.compliance >= 40) return 'text-amber-400';
    return 'text-rose-400';
  }, [state.compliance]);

  const finalVerdict = useMemo(() => {
    if (state.compliance < 30) {
      return "CRÍTICO: O projeto falhou em governança e cultura. Vazamentos, sindicatos em greve ou perda total de confiança destruíram a adoção corporativa. Você foi demitido.";
    } else if (state.budget <= 0) {
      return "FALÊNCIA FINANCEIRA: O assistente é bom, mas você queimou muito dinheiro com infraestrutura e incidentes. O CFO cancelou o projeto.";
    } else if (state.time <= 4) {
      return "FRACASSO B2B: O produto demorou tanto que a concorrência engoliu o mercado. O perfeccionismo de engenharia matou o timing.";
    } else if (state.accuracy < 50) {
      return "REJEIÇÃO DE MERCADO: Rápido e barato, mas inútil. Alucinações, UX travada e burrice artificial causaram Churn altíssimo na base de clientes.";
    } else {
      return "🏆 SUCESSO ABSOLUTO! Você equilibrou magistralmente a loucura da engenharia, o ego da diretoria, os riscos legais e o estouro da Nuvem. Você foi promovido a VP de Inteligência Artificial!";
    }
  }, [state]);

  const StatCard = ({ icon: Icon, label, value, subValue, statusClass }: any) => (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex flex-col items-center min-w-[120px]">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="text-slate-400 w-4 h-4" />
        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{label}</span>
      </div>
      <span className={`text-xl font-black ${statusClass}`}>{value}</span>
      {subValue && <span className="text-[10px] text-slate-500 mt-1">{subValue}</span>}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Background */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'url(/smartbev-bg.png)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(0.8)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/95 to-slate-950 pointer-events-none" />

      {/* HEADER BAR */}
      <header className="relative z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FiBriefcase className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">AI PRODUCT <span className="text-blue-500">SIMULATOR</span></h1>
              <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> GlobalBev Corp
              </p>
            </div>
          </div>
          {(state.view === 'playing' || state.view === 'results') && (
            <div className="flex flex-wrap justify-center gap-3">
              <StatCard icon={FiDollarSign} label="Caixa" value={`$${state.budget}K`} statusClass={budgetStatus} />
              <StatCard icon={FiClock} label="Prazo" value={`${state.time}M`} statusClass={state.time > 8 ? 'text-blue-400' : 'text-rose-400'} />
              <StatCard icon={FiActivity} label="Acurácia / UX" value={`${state.accuracy}%`} statusClass={state.accuracy > 70 ? 'text-emerald-400' : 'text-amber-400'} />
              <StatCard icon={FiShield} label="Score Risco" value={`${state.compliance}%`} statusClass={complianceStatus} />
            </div>
          )}
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 pb-32">
        <AnimatePresence mode="wait">
          
          {/* VIEW: INTRO */}
          {state.view === 'intro' && (
            <motion.section key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-3xl mx-auto text-center mt-12">
              <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Você é o <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Head of AI Product</span></h2>
                <p className="text-lg text-slate-400 mb-8 leading-relaxed max-w-2xl mx-auto">
                  A cada "run", 4 crises aleatórias do banco de 12 cenários corporativos cruzarão sua mesa. Suas escolhas definem se a IA da GlobalBev vai falir a empresa, gerar revoltas do sindicato, vazar dados na internet ou se tornar o maior case de B2B do mercado.
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                  <button onClick={startGame} className="group bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 px-10 rounded-2xl flex items-center gap-3 transition-all scale-105 shadow-xl shadow-blue-500/20">
                    INICIAR JORNADA <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => setState(prev => ({ ...prev, view: 'quick_cases' }))} className="group bg-slate-800 hover:bg-slate-700 text-white font-bold py-5 px-10 rounded-2xl flex items-center gap-3 transition-all hover:scale-105 border border-slate-700">
                    <FiBriefcase className="text-blue-400 group-hover:scale-110 transition-transform" /> QUICK CASES
                  </button>
                </div>
              </div>
            </motion.section>
          )}

          {/* VIEW: QUICK CASES */}
          {state.view === 'quick_cases' && (
            <QuickCasesView onBack={() => setState(prev => ({ ...prev, view: 'intro' }))} />
          )}

          {/* VIEW: PLAYING */}
          {state.view === 'playing' && currentScenario && currentPhaseDef && (
            <motion.section key={`scenario-${state.currentPhaseIndex}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl mx-auto">
              <div className="mb-4 flex items-center gap-3">
                <span className="text-xs font-black tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full text-slate-300">
                  Fase {state.currentPhaseIndex + 1} de 4
                </span>
                <span className="text-xs font-bold tracking-widest text-blue-400 uppercase">
                  {currentPhaseDef.title}
                </span>
              </div>
              
              <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-500" />
                <div className="flex gap-6 items-start">
                  <div className="bg-slate-800 p-4 rounded-2xl hidden md:block text-blue-400">
                    <currentScenario.icon size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">{currentScenario.title}</h2>
                    <p className="text-lg text-slate-300 leading-relaxed">{currentScenario.context}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentScenario.options.map((opt) => (
                  <button 
                    key={opt.id} 
                    onClick={() => selectOption(currentScenario, opt)}
                    className="text-left group cursor-pointer p-6 rounded-[2rem] border-2 border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 hover:border-slate-600 transition-all flex flex-col justify-between min-h-[220px]"
                  >
                    <div>
                      <h3 className="font-bold text-white text-lg mb-3 leading-snug group-hover:text-blue-400 transition-colors">{opt.label}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-6">{opt.desc}</p>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      {opt.impacts.budget !== 0 && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${opt.impacts.budget < 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {opt.impacts.budget < 0 ? '' : '+'}{opt.impacts.budget}K Caixa
                        </span>
                      )}
                      {opt.impacts.time !== 0 && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${opt.impacts.time < 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {opt.impacts.time < 0 ? '' : '+'}{opt.impacts.time}m TTM
                        </span>
                      )}
                      {opt.impacts.accuracy !== 0 && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${opt.impacts.accuracy < 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {opt.impacts.accuracy < 0 ? '' : '+'}{opt.impacts.accuracy}% Acc
                        </span>
                      )}
                      {opt.impacts.compliance !== 0 && (
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${opt.impacts.compliance < 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                          {opt.impacts.compliance < 0 ? '' : '+'}{opt.impacts.compliance}% Risco
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {/* VIEW: RESULTS */}
          {state.view === 'results' && (
            <motion.section key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 max-w-4xl mx-auto">
              <div className="text-center">
                <h2 className="text-5xl font-black text-white mb-2">RELATÓRIO PÓS-MORTEM</h2>
                <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Diagnóstico do Ciclo de Vida do Produto B2B</p>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-900/50 border border-white/10 p-10 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
                {/* Decorative glow based on success */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[100px] opacity-20 pointer-events-none ${state.compliance < 30 || state.budget <= 0 ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                
                <h3 className="text-2xl font-black text-white mb-6 relative z-10">VEREDITO DA DIRETORIA</h3>
                <p className="text-xl text-slate-200 font-medium leading-relaxed max-w-3xl mx-auto relative z-10">
                  {finalVerdict}
                </p>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 mt-8">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Suas Escolhas Críticas:</h4>
                <div className="space-y-4">
                  {state.history.map((hist, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-white/5 rounded-xl bg-black/20 gap-4">
                      <div>
                        <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">Fase {idx + 1}: {hist.scenario.title}</p>
                        <p className="text-white font-medium">{hist.option.label}</p>
                      </div>
                      <div className="flex gap-2">
                        {hist.option.impacts.budget !== 0 && <span className={`text-xs px-2 py-1 rounded bg-black/50 ${hist.option.impacts.budget < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>Budget {hist.option.impacts.budget}K</span>}
                        {hist.option.impacts.compliance !== 0 && <span className={`text-xs px-2 py-1 rounded bg-black/50 ${hist.option.impacts.compliance < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>Compliance {hist.option.impacts.compliance}%</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-12">
                <button onClick={() => setState(prev => ({ ...prev, view: 'intro' }))} className="bg-white text-slate-950 font-black py-4 px-12 rounded-2xl hover:bg-slate-200 transition-all scale-105">
                  NOVA SIMULAÇÃO
                </button>
              </div>
            </motion.section>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
