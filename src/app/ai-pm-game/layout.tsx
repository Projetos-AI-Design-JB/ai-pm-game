import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Product Manager | GlobalBev Business Simulator',
  description: 'Simulador interativo do ciclo de vida de produtos de Inteligência Artificial para o mercado corporativo B2B. Sobreviva aos 12 cenários de risco de um AI PM.',
};

export default function AIPMGameLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
