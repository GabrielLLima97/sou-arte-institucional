import { Icon } from "./Icons";

export function PublicHeader() {
  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-white/30 bg-white/45 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_8px_30px_rgba(31,109,209,0.08)]">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-6 py-1.5">
          <a href="#inicio" className="flex items-center">
            <img
              src="/brand/logo-retangular.png"
              alt="Sou Arte em Cuidados"
              className="h-16 w-auto sm:h-[4.5rem] lg:h-[5rem]"
            />
          </a>
          <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold text-[#1a2732]">
            <a href="#sobre" className="rounded-md px-2 py-1 transition-colors hover:text-[#1f6dd1]">
              Sobre
            </a>
            <a href="#servicos" className="rounded-md px-2 py-1 transition-colors hover:text-[#1f6dd1]">
              Serviços
            </a>
            <a href="#clientes" className="rounded-md px-2 py-1 transition-colors hover:text-[#1f6dd1]">
              Clientes
            </a>
            <a href="#cidades" className="rounded-md px-2 py-1 transition-colors hover:text-[#1f6dd1]">
              Cidades
            </a>
            <a href="#associados" className="rounded-md px-2 py-1 transition-colors hover:text-[#1f6dd1]">
              Associados
            </a>
            <a href="#contato" className="rounded-md px-2 py-1 transition-colors hover:text-[#1f6dd1]">
              Contato
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-full bg-[#ff6b6b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-[#e85b5b]"
            >
              <Icon name="mail" className="h-4 w-4" />
              Contato
            </a>
          </div>
        </header>
      </div>
    </div>
  );
}
