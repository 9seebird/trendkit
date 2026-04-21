import ExcelUploader from "@/app/components/ExcelUploader";
import ManualModal from "@/app/components/ManualModal";
import DarkModeToggle from "@/app/components/ExcelUploader/DarkModeToggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* 메인 홈으로 돌아가는 링크 */}
          <Link
            href="https://trendkit.app"
            className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            ← trendkit
          </Link>
          <span className="text-slate-200 dark:text-slate-700">|</span>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Smart Excel Merger
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <ManualModal />
        </div>
      </header>
      <main className="container mx-auto py-8">
        <ExcelUploader />
      </main>
    </div>
  );
}
