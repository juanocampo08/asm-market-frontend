import { Suspense } from 'react';
import { MisEncargosView } from '@/features/encargos/components/MisEncargosView';

export default function MisEncargosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-xs uppercase tracking-widest text-slate-400">
          Cargando tus encargos...
        </div>
      }
    >
      <MisEncargosView />
    </Suspense>
  );
}