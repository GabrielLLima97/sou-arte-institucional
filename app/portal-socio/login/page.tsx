import { LoginCard } from "../../../components/portal/LoginCard";

export default function PortalSocioLoginPage() {
  return (
    <main className="min-h-screen bg-[#f6f1e8]">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center px-6 py-20">
        <LoginCard
          title="Portal do Sócio"
          subtitle="Acesso exclusivo para profissionais cadastrados na Sou Arte em Cuidados."
          role="socio"
          successPath="/portal-socio"
        />
      </div>
    </main>
  );
}
