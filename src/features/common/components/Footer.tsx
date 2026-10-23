import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#1B2632] text-white border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center border border-[#D4A373] text-base font-serif text-[#D4A373]">
              A
            </span>
            <span className="text-lg tracking-wide text-white">
              <strong className="font-bold">ASM</strong>{' '}
              <em className="font-serif italic text-[#D4A373]">Market</em>
            </span>
          </div>

          {/* Frase editorial en cursiva */}
          <p className="font-serif italic text-lg text-slate-300">
            Lo excepcional, más cerca de ti.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-slate-300">
            <Link href="/#catalogo" className="hover:text-[#D4A373] transition-colors">
              Catálogo
            </Link>
            <Link href="/#encargos" className="hover:text-[#D4A373] transition-colors">
              Encargos
            </Link>
            <a
              href="https://instagram.com/asmmarket_"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#D4A373] transition-colors"
            >
              @asmmarket_
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>&copy; 2026 ASM Market. Colombia.</p>
          <p>Originales de USA · Entregados con cuidado</p>
        </div>
      </div>
    </footer>
  );
}