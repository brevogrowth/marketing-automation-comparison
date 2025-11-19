import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { BusinessAssumptions } from '@/components/BusinessAssumptions';
import { OverviewByCategory } from '@/components/OverviewByCategory';
import { SectorKpiSection } from '@/components/SectorKpiSection';
import { PersonalizedAnalysis } from '@/components/PersonalizedAnalysis';
import { ActionPlan } from '@/components/ActionPlan';
import { CtaSection } from '@/components/CtaSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />
        <BusinessAssumptions />
        <OverviewByCategory />
        <SectorKpiSection />
        <PersonalizedAnalysis />
        <ActionPlan />
        <CtaSection />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            © 2024 Brevo. Tous droits réservés. | Marketing KPI Benchmark - Page d'exemple
          </p>
        </div>
      </footer>
    </div>
  );
}
