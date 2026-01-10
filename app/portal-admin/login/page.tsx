import { LoginCard } from "../../../components/portal/LoginCard";

export default function PortalAdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#f6f1e8]">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center px-6 py-20">
        <LoginCard
          title="Portal Administrativo"
          subtitle="Acesso restrito para a equipe de gestão e administração."
          role="admin"
          successPath="/portal-admin"
        />
      </div>
    </main>
  );
}
