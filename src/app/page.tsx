'use client';

import { Suspense, useState } from 'react';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Navbar } from '@/features/common/components/Navbar';
import { Footer } from '@/features/common/components/Footer';
import type { Product } from '@/features/productos/domain/product';
import { CatalogSection } from '@/features/productos/components/CatalogSection';
import { EncargoFormSection } from '@/features/encargos/components/EncargoFormSection';

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* HERO EDITORIAL (Diseño Figma) */}
        <section className="relative overflow-hidden border-b border-slate-100 bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
              {/* Columna Izquierda */}
              <div className="lg:col-span-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="h-px w-10 bg-[#D4A373]" />
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4A373]">
                    Selección Curada · USA → Colombia
                  </span>
                </div>

                <h1 className="font-serif text-5xl sm:text-6xl leading-[1.08] text-[#233140]">
                  Productos originales{' '}
                  <em className="block font-serif italic font-normal text-[#D4A373]">
                    de USA en Colombia
                  </em>
                </h1>

                <p className="mt-6 text-base leading-relaxed text-slate-500 max-w-xl">
                  Cuidado de la piel, vitaminas y moda importados directamente
                  desde Estados Unidos. Explora nuestro catálogo o solicita un
                  encargo personalizado a tu medida.
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a
                    href="#encargos"
                    className="inline-flex items-center gap-4 border-l-4 border-[#D4A373] bg-[#233140] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#1b2632]"
                  >
                    <span>Solicitar un encargo</span>
                    <ArrowRight className="h-4 w-4 text-[#D4A373]" />
                  </a>

                  <a
                    href="#catalogo"
                    className="inline-flex items-center gap-2 border border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#233140] transition-colors hover:border-[#D4A373]"
                  >
                    <span>Ver Catálogo</span>
                  </a>
                </div>

                {/* Sellos de confianza */}
                <div className="mt-12 grid grid-cols-2 gap-6 border-t border-slate-100 pt-8 max-w-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center bg-[#F8F9FA] text-[#D4A373]">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#233140]">
                        100% Original
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Tiendas oficiales USA
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center bg-[#F8F9FA] text-[#D4A373]">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#233140]">
                        Envío Seguro
                      </p>
                      <p className="text-[11px] text-slate-400">
                        A toda Colombia
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Imagen Editorial + Tarjeta Flotante */}
              <div className="relative lg:col-span-6">
                <div className="relative mx-auto max-w-lg lg:max-w-none">
                  <div className="aspect-4/3 overflow-hidden border border-slate-200 bg-[#F8F9FA] shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/images/Guess.jpg"
                      alt="Colección importada ASM Market"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Tarjeta flotante inferior derecha */}
                  <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:-right-4 border border-slate-200 bg-white p-5 shadow-xl max-w-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-2xl font-bold text-[#D4A373]">
                        01
                      </span>
                      <span className="h-6 w-px bg-slate-200" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#233140]">
                          Curado para ti
                        </p>
                        <p className="text-xs text-slate-500">
                          Piezas especiales, sin fronteras.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN CATÁLOGO PAGINADO Y FILTRADO */}
        <Suspense
          fallback={
            <div className="py-20 text-center text-xs uppercase tracking-widest text-slate-400">
              Cargando catálogo de ASM Market...
            </div>
          }
        >
          <CatalogSection onSelectProductForEncargo={setSelectedProduct} />
        </Suspense>

        {/* SECCIÓN FORMULARIO DE ENCARGOS */}
        <EncargoFormSection selectedProduct={selectedProduct} />
      </main>

      <Footer />
    </div>
  );
}