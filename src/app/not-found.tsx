import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/features/common/components/Navbar';
import { Footer } from '@/features/common/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full border border-slate-200 bg-white p-10 sm:p-14 text-center shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#D4A373]">
            Error 404
          </span>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-[#233140]">
            Página no encontrada
          </h1>
          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-500">
            La ruta que estás buscando no existe o fue trasladada dentro de
            nuestro catálogo curado.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 border-l-4 border-[#D4A373] bg-[#233140] px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#1b2632] transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-[#D4A373]" />
            <span>Volver al inicio</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}