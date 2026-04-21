import ExcelUploader from "@/app/components/ExcelUploader";
import ManualModal from "@/app/components/ManualModal";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b px-8 py-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Smart Excel Merger</h1>
        <ManualModal />
      </header>
      <main className="container mx-auto py-8">
        <ExcelUploader />
      </main>
    </div>
  );
}
