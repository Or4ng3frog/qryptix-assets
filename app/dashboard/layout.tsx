import { DashboardNav } from '@/components/DashboardNav';
import { getDashboardData } from '@/lib/dashboard-data';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const data = await getDashboardData();
  const preview = data?.preview ?? true;

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-50 bg-void/90 backdrop-blur-xl border-b border-violet/10">
        <div className="mx-auto max-w-6xl px-6 py-3.5 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/Q_Only.png" alt="Qryptix" className="h-8 w-8" />
            <span className="font-display font-semibold">QRYPTIX</span>
            <span className="text-xs text-fog ml-2 pl-3 border-l border-violet/15 hidden sm:inline">Dashboard</span>
          </a>
          <div className="flex items-center gap-3">
            {preview && (
              <span className="hidden sm:inline rounded-full border border-amber-400/25 bg-amber-400/[0.06] px-3 py-1 text-[11px] text-amber-200/80">
                Preview mode
              </span>
            )}
            <a href="/" className="text-sm text-mist hover:text-ghost transition-colors">← Home</a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 grid lg:grid-cols-[220px_1fr] gap-8">
        <DashboardNav />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
