"use client";

import { useEffect, useMemo, useState } from "react";
import { PortalShell } from "../../../components/portal/PortalShell";
import { Modal } from "../../../components/portal/Modal";
import { apiFetch } from "../../../lib/api";
import type { User, UserRole } from "../../../lib/types";

const NAV_LINKS = [
  { label: "Dashboard", href: "/portal-admin" },
  { label: "Usuários", href: "/portal-admin/usuarios" },
  { label: "Comunicados", href: "/portal-admin/comunicados" },
  { label: "Cursos", href: "/portal-admin/cursos" },
  { label: "Benefícios", href: "/portal-admin/beneficios" },
];

const PAGE_SIZE = 50;

type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  city: string;
  uf: string;
  admission_date: string;
  profession: string;
};

type EditUserFormState = {
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  city: string;
  uf: string;
  admission_date: string;
  profession: string;
};

type ImportError = {
  row: number;
  message: string;
};

type ImportRow = {
  row: number;
  name: string;
  email: string;
  city: string | null;
  uf: string | null;
  admission_date: string | null;
  profession: string | null;
  exists: boolean;
  needs_completion: boolean;
  missing_fields: string[];
};

type ImportPreview = {
  processed: number;
  valid_rows: number;
  new_rows: ImportRow[];
  existing_rows: ImportRow[];
  completion_rows: ImportRow[];
  missing_in_file: User[];
  errors: ImportError[];
};

type ImportApplyResult = {
  processed: number;
  created: number;
  updated: number;
  deleted: number;
  skipped: number;
  errors: ImportError[];
};

const roleLabel = (role: UserRole) => (role === "admin" ? "Administrador" : "Sócio");

const formatDate = (value: string | null) => {
  if (!value) {
    return "-";
  }
  const normalized = value.slice(0, 10);
  const [year, month, day] = normalized.split("-");
  if (!year || !month || !day) {
    return value;
  }
  return `${day}/${month}/${year}`;
};

const normalizeText = (value: string | null | undefined) => (value ?? "").trim();

export default function PortalAdminUsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<CreateUserPayload>({
    name: "",
    email: "",
    password: "",
    role: "socio",
    city: "",
    uf: "",
    admission_date: "",
    profession: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditUserFormState | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const [passwordUser, setPasswordUser] = useState<User | null>(null);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordGenerated, setPasswordGenerated] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTab, setPreviewTab] = useState<"novos" | "complementos" | "exclusao" | "existentes">("novos");
  const [importRoleMap, setImportRoleMap] = useState<Record<string, UserRole>>({});

  const [applyCreateNew, setApplyCreateNew] = useState(true);
  const [applyFillMissing, setApplyFillMissing] = useState(true);
  const [applyDeleteMissing, setApplyDeleteMissing] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applyResult, setApplyResult] = useState<ImportApplyResult | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const loadUsers = async () => {
    try {
      const data = await apiFetch<User[]>("/admin/users");
      setUsers(data);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        term.length === 0 ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        (user.city ?? "").toLowerCase().includes(term) ||
        (user.profession ?? "").toLowerCase().includes(term);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" || (statusFilter === "active" ? user.active : !user.active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedUsers = filteredUsers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const generatePassword = (length = 10) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#";
    let result = "";
    for (let i = 0; i < length; i += 1) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload: CreateUserPayload = {
      ...form,
      name: normalizeText(form.name),
      email: normalizeText(form.email),
      password: normalizeText(form.password),
      city: normalizeText(form.city),
      uf: normalizeText(form.uf).toUpperCase(),
      admission_date: normalizeText(form.admission_date),
      profession: normalizeText(form.profession),
    };

    try {
      await apiFetch<User>("/admin/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setForm({
        name: "",
        email: "",
        password: "",
        role: "socio",
        city: "",
        uf: "",
        admission_date: "",
        profession: "",
      });
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao criar usuário.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      city: user.city ?? "",
      uf: user.uf ?? "",
      admission_date: user.admission_date ? user.admission_date.slice(0, 10) : "",
      profession: user.profession ?? "",
    });
    setEditError(null);
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !editForm) {
      return;
    }

    setEditLoading(true);
    setEditError(null);

    try {
      await apiFetch<User>(`/admin/users/${editingUser.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
          role: editForm.role,
          active: editForm.active,
          city: normalizeText(editForm.city) || null,
          uf: normalizeText(editForm.uf).toUpperCase() || null,
          admission_date: normalizeText(editForm.admission_date) || null,
          profession: normalizeText(editForm.profession) || null,
        }),
      });
      setEditingUser(null);
      setEditForm(null);
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar usuário.";
      setEditError(message);
    } finally {
      setEditLoading(false);
    }
  };

  const openPasswordModal = (user: User, mode: "edit" | "reset") => {
    const generated = mode === "reset" ? generatePassword() : "";
    setPasswordUser(user);
    setPasswordValue(generated);
    setPasswordGenerated(mode === "reset");
    setPasswordError(null);
  };

  const handlePasswordUpdate = async () => {
    if (!passwordUser) {
      return;
    }
    if (!passwordValue.trim()) {
      setPasswordError("Informe uma senha válida.");
      return;
    }

    setPasswordLoading(true);
    setPasswordError(null);

    try {
      await apiFetch<User>(`/admin/users/${passwordUser.id}/password`, {
        method: "PATCH",
        body: JSON.stringify({ password: passwordValue.trim() }),
      });
      setPasswordUser(null);
      setPasswordValue("");
      setPasswordGenerated(false);
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar senha.";
      setPasswordError(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) {
      return;
    }

    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await apiFetch(`/admin/users/${deleteUser.id}`, { method: "DELETE" });
      setDeleteUser(null);
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir usuário.";
      setDeleteError(message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const toggleActive = async (user: User) => {
    try {
      await apiFetch(`/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({ active: !user.active }),
      });
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao atualizar usuário.";
      setError(message);
    }
  };

  const requestPreview = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<ImportPreview>("/admin/users/import/preview", {
      method: "POST",
      body: formData,
    });
  };

  const handleImportPreview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!importFile) {
      setImportError("Selecione o arquivo exportado do Pega Plantão.");
      return;
    }

    setImportLoading(true);
    setImportError(null);
    setApplyError(null);
    setApplyResult(null);

    try {
      const preview = await requestPreview(importFile);
      setImportPreview(preview);
      setImportRoleMap((previous) => {
        const nextMap: Record<string, UserRole> = {};
        preview.new_rows.forEach((row) => {
          const email = row.email.toLowerCase();
          nextMap[email] = previous[email] ?? "socio";
        });
        return nextMap;
      });
      setPreviewModalOpen(true);
      if (preview.new_rows.length > 0) {
        setPreviewTab("novos");
      } else if (preview.completion_rows.length > 0) {
        setPreviewTab("complementos");
      } else if (preview.missing_in_file.length > 0) {
        setPreviewTab("exclusao");
      } else {
        setPreviewTab("existentes");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao analisar o arquivo.";
      setImportError(message);
    } finally {
      setImportLoading(false);
    }
  };

  const handleApplyImport = async () => {
    if (!importFile) {
      setApplyError("Selecione novamente o arquivo para aplicar a importação.");
      return;
    }

    setApplyLoading(true);
    setApplyError(null);
    setApplyResult(null);

    try {
      const query = new URLSearchParams({
        create_new: String(applyCreateNew),
        fill_missing_data: String(applyFillMissing),
        delete_missing_users: String(applyDeleteMissing),
      });

      const formData = new FormData();
      formData.append("file", importFile);
      formData.append("role_map_json", JSON.stringify(importRoleMap));

      const result = await apiFetch<ImportApplyResult>(`/admin/users/import/apply?${query.toString()}`, {
        method: "POST",
        body: formData,
      });

      setApplyResult(result);
      await loadUsers();

      const refreshedPreview = await requestPreview(importFile);
      setImportPreview(refreshedPreview);
      setImportRoleMap((previous) => {
        const nextMap: Record<string, UserRole> = {};
        refreshedPreview.new_rows.forEach((row) => {
          const email = row.email.toLowerCase();
          nextMap[email] = previous[email] ?? "socio";
        });
        return nextMap;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao aplicar importação.";
      setApplyError(message);
    } finally {
      setApplyLoading(false);
    }
  };

  const compactActionClass =
    "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] transition hover:-translate-y-0.5";

  return (
    <PortalShell role="admin" loginPath="/portal-admin/login" title="Portal Administrativo" links={NAV_LINKS}>
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Gestão de usuários</div>
          <h1 className="mt-3 text-3xl font-bold text-[#1a2732]">Controle de acessos</h1>
          <p className="mt-3 text-sm text-[#5b6b78]">
            Gerencie usuários, acompanhe importações em lote do Pega Plantão e mantenha os dados profissionais atualizados.
          </p>
        </div>

        <form onSubmit={handleCreate} className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#ff6b6b]">Novo usuário</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-[#2f4050]">
              Nome completo
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              E-mail
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Senha provisória
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Cidade
              <input
                type="text"
                value={form.city}
                onChange={(event) => setForm({ ...form, city: event.target.value })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              UF
              <input
                type="text"
                maxLength={2}
                value={form.uf}
                onChange={(event) => setForm({ ...form, uf: event.target.value.toUpperCase() })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm uppercase focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Data de admissão
              <input
                type="date"
                value={form.admission_date}
                onChange={(event) => setForm({ ...form, admission_date: event.target.value })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Profissão
              <input
                type="text"
                value={form.profession}
                onChange={(event) => setForm({ ...form, profession: event.target.value })}
                required
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>
            <label className="text-sm font-semibold text-[#2f4050]">
              Perfil
              <select
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value as UserRole })}
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              >
                <option value="socio">Sócio</option>
                <option value="admin">Administrador</option>
              </select>
            </label>
          </div>
          {error && (
            <div className="mt-4 rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6b6b]">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Salvando..." : "Criar usuário"}
          </button>
        </form>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Importação em massa</div>
          <h2 className="mt-2 text-2xl font-bold text-[#1a2732]">Usuários em lote - Pega Plantão</h2>
          <p className="mt-2 text-sm text-[#5b6b78]">
            Importe o arquivo do Pega Plantão para analisar novos usuários, complementar dados faltantes e identificar quem não
            está mais na lista atualizada.
          </p>
          <div className="mt-3 inline-flex items-center rounded-full border border-[#1f6dd1]/20 bg-[#f2f6ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f6dd1]">
            Senha inicial dos novos usuários: 123456
          </div>

          <form onSubmit={handleImportPreview} className="mt-5 rounded-3xl border border-[#e5d6c5] bg-white/80 p-5">
            <label className="block text-sm font-semibold text-[#2f4050]">
              Arquivo do Pega Plantão (.xlsx)
              <input
                type="file"
                accept=".xlsx"
                onChange={(event) => {
                  setImportFile(event.target.files?.[0] ?? null);
                  setImportError(null);
                  setImportPreview(null);
                  setImportRoleMap({});
                  setApplyError(null);
                  setApplyResult(null);
                }}
                className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              />
            </label>

            {importFile && <div className="mt-2 text-xs text-[#5b6b78]">Selecionado: {importFile.name}</div>}

            {importError && (
              <div className="mt-4 rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6b6b]">
                {importError}
              </div>
            )}

            <button
              type="submit"
              disabled={importLoading}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {importLoading ? "Analisando..." : "Analisar arquivo"}
            </button>
          </form>

          {applyResult && (
            <div className="mt-4 rounded-2xl border border-[#1f6dd1]/25 bg-[#f2f6ff] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#1f6dd1]">
              Aplicado: {applyResult.created} criados · {applyResult.updated} atualizados · {applyResult.deleted} excluídos · {" "}
              {applyResult.skipped} ignorados
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Usuários cadastrados</div>
              <div className="mt-2 text-sm text-[#5b6b78]">
                {filteredUsers.length} resultado(s) · Página {safePage} de {totalPages}
              </div>
            </div>

            <div className="grid w-full gap-3 md:w-auto md:grid-cols-3">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por nome, e-mail, cidade ou profissão"
                className="w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-2.5 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20 md:min-w-[300px]"
              />
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value as "all" | UserRole)}
                className="rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-2.5 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              >
                <option value="all">Todos os perfis</option>
                <option value="admin">Administrador</option>
                <option value="socio">Sócio</option>
              </select>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "all" | "active" | "inactive")}
                className="rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-2.5 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
              >
                <option value="all">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.2em] text-[#1f6dd1]">
                <tr>
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">E-mail</th>
                  <th className="py-2 pr-4">Cidade/UF</th>
                  <th className="py-2 pr-4">Profissão</th>
                  <th className="py-2 pr-4">Admissão</th>
                  <th className="py-2 pr-4">Perfil</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Ações</th>
                </tr>
              </thead>
              <tbody className="text-[#3b4b5a]">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="border-t border-[#f0e4d7]">
                    <td className="py-3 pr-4 font-semibold text-[#1a2732]">{user.name}</td>
                    <td className="py-3 pr-4">{user.email}</td>
                    <td className="py-3 pr-4">{[user.city, user.uf].filter(Boolean).join("/") || "-"}</td>
                    <td className="py-3 pr-4">{user.profession || "-"}</td>
                    <td className="py-3 pr-4">{formatDate(user.admission_date)}</td>
                    <td className="py-3 pr-4">{roleLabel(user.role)}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                          user.active ? "bg-[#e6f0ff] text-[#1f6dd1]" : "bg-[#ffe3e3] text-[#ff6b6b]"
                        }`}
                      >
                        {user.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditUser(user)}
                          className={`${compactActionClass} border-[#1f6dd1]/30 text-[#1f6dd1] hover:bg-[#f2f6ff]`}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => openPasswordModal(user, "edit")}
                          className={`${compactActionClass} border-[#1f6dd1]/30 text-[#1f6dd1] hover:bg-[#f2f6ff]`}
                        >
                          Senha
                        </button>
                        <button
                          type="button"
                          onClick={() => openPasswordModal(user, "reset")}
                          className={`${compactActionClass} border-[#ff6b6b]/30 text-[#ff6b6b] hover:bg-[#ffe3e3]`}
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleActive(user)}
                          className={`${compactActionClass} border-[#1f6dd1]/30 text-[#1f6dd1] hover:bg-[#f2f6ff]`}
                        >
                          {user.active ? "Desativar" : "Ativar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteUser(user);
                            setDeleteError(null);
                          }}
                          className={`${compactActionClass} border-[#ff6b6b]/40 text-[#ff6b6b] hover:bg-[#ffe3e3]`}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedUsers.length === 0 && (
                  <tr>
                    <td className="py-4 text-sm text-[#5b6b78]" colSpan={8}>
                      Nenhum usuário encontrado para o filtro atual.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-[#5b6b78]">
              Exibindo {paginatedUsers.length} de {filteredUsers.length} usuário(s)
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                className="rounded-full border border-[#1f6dd1]/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f6dd1] transition hover:bg-[#f2f6ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="rounded-full bg-[#f2f6ff] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f6dd1]">
                {safePage}/{totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
                className="rounded-full border border-[#1f6dd1]/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f6dd1] transition hover:bg-[#f2f6ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={previewModalOpen && Boolean(importPreview)}
        title="Análise da importação"
        eyebrow="Pega Plantão"
        iconName="info"
        tone="primary"
        widthClassName="max-w-6xl"
        bodyClassName="overflow-hidden"
        onClose={() => {
          setPreviewModalOpen(false);
          setApplyError(null);
        }}
      >
        {importPreview && (
          <div className="flex max-h-[calc(100dvh-8rem)] flex-col gap-4 sm:max-h-[calc(100dvh-9rem)]">
            <div className="grid flex-none gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[#1f6dd1]/20 bg-[#f2f6ff] p-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1f6dd1]">Linhas lidas</div>
                <div className="mt-1 text-lg font-bold text-[#1a2732]">{importPreview.processed}</div>
              </div>
              <div className="rounded-2xl border border-[#1f6dd1]/20 bg-[#f2f6ff] p-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1f6dd1]">Novos usuários</div>
                <div className="mt-1 text-lg font-bold text-[#1a2732]">{importPreview.new_rows.length}</div>
              </div>
              <div className="rounded-2xl border border-[#f6a63b]/30 bg-[#fff7ea] p-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b8741e]">Complementar dados</div>
                <div className="mt-1 text-lg font-bold text-[#1a2732]">{importPreview.completion_rows.length}</div>
              </div>
              <div className="rounded-2xl border border-[#ff6b6b]/25 bg-[#ffecec] p-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ff6b6b]">Fora da lista</div>
                <div className="mt-1 text-lg font-bold text-[#1a2732]">{importPreview.missing_in_file.length}</div>
              </div>
            </div>

            <div className="grid flex-none gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#e5d6c5] bg-white/90 p-4 md:min-h-[198px]">
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1f6dd1]">Aplicar importação</div>
                <div className="mt-3 grid gap-2 text-sm text-[#2f4050]">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={applyCreateNew}
                      onChange={(event) => setApplyCreateNew(event.target.checked)}
                      className="h-4 w-4 rounded border-[#1f6dd1]/30"
                    />
                    Criar novos usuários ({importPreview.new_rows.length})
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={applyFillMissing}
                      onChange={(event) => setApplyFillMissing(event.target.checked)}
                      className="h-4 w-4 rounded border-[#1f6dd1]/30"
                    />
                    Complementar dados faltantes ({importPreview.completion_rows.length})
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={applyDeleteMissing}
                      onChange={(event) => setApplyDeleteMissing(event.target.checked)}
                      className="h-4 w-4 rounded border-[#1f6dd1]/30"
                    />
                    Excluir usuários fora da lista atual ({importPreview.missing_in_file.length})
                  </label>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleApplyImport}
                    disabled={applyLoading}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {applyLoading ? "Aplicando..." : "Aplicar sincronização"}
                  </button>
                </div>

                {applyError && (
                  <div className="mt-3 rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b6b]">
                    {applyError}
                  </div>
                )}
              </div>

              <div
                className={`rounded-2xl border px-4 py-4 ${
                  importPreview.errors.length > 0
                    ? "border-[#ff6b6b]/25 bg-[#ffecec]"
                    : "border-[#1f6dd1]/20 bg-[#f2f6ff]"
                } md:min-h-[198px]`}
              >
                <div
                  className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                    importPreview.errors.length > 0 ? "text-[#b94444]" : "text-[#1f6dd1]"
                  }`}
                >
                  Inconsistências encontradas
                </div>
                <div className="mt-1 text-[11px] font-medium text-[#5b6b78]">
                  {importPreview.errors.length} item(ns) com pendência de preenchimento.
                </div>
                <div className="mt-3 max-h-[130px] space-y-1 overflow-y-auto pr-1 text-xs text-[#b94444] md:max-h-[140px]">
                  {importPreview.errors.length > 0 ? (
                    importPreview.errors.map((item) => (
                      <div key={`${item.row}-${item.message}`}>
                        Linha {item.row}: {item.message}
                      </div>
                    ))
                  ) : (
                    <div className="text-[#1f6dd1]">Nenhuma inconsistência encontrada neste arquivo.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-none inline-flex flex-wrap items-center gap-2 rounded-full border border-[#1f6dd1]/20 bg-[#f2f6ff] p-1">
              <button
                type="button"
                onClick={() => setPreviewTab("novos")}
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                  previewTab === "novos" ? "bg-[#1f6dd1] text-white" : "text-[#1f6dd1]"
                }`}
              >
                Novos ({importPreview.new_rows.length})
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("complementos")}
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                  previewTab === "complementos" ? "bg-[#1f6dd1] text-white" : "text-[#1f6dd1]"
                }`}
              >
                Complementos ({importPreview.completion_rows.length})
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("exclusao")}
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                  previewTab === "exclusao" ? "bg-[#1f6dd1] text-white" : "text-[#1f6dd1]"
                }`}
              >
                Exclusão ({importPreview.missing_in_file.length})
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("existentes")}
                className={`rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                  previewTab === "existentes" ? "bg-[#1f6dd1] text-white" : "text-[#1f6dd1]"
                }`}
              >
                Existentes ({importPreview.existing_rows.length})
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto rounded-2xl border border-[#e5d6c5] bg-white/90">
              {previewTab === "novos" && (
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 bg-white text-[10px] uppercase tracking-[0.2em] text-[#1f6dd1]">
                    <tr>
                      <th className="px-3 py-2">Nome</th>
                      <th className="px-3 py-2">E-mail</th>
                      <th className="px-3 py-2">Cidade/UF</th>
                      <th className="px-3 py-2">Profissão</th>
                      <th className="px-3 py-2">Perfil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.new_rows.map((row) => (
                      <tr key={`new-${row.email}`} className="border-t border-[#f0e4d7]">
                        <td className="px-3 py-2 font-semibold text-[#1a2732]">{row.name}</td>
                        <td className="px-3 py-2">{row.email}</td>
                        <td className="px-3 py-2">{[row.city, row.uf].filter(Boolean).join("/") || "-"}</td>
                        <td className="px-3 py-2">{row.profession || "-"}</td>
                        <td className="px-3 py-2">
                          <select
                            value={importRoleMap[row.email.toLowerCase()] ?? "socio"}
                            onChange={(event) =>
                              setImportRoleMap((previous) => ({
                                ...previous,
                                [row.email.toLowerCase()]: event.target.value as UserRole,
                              }))
                            }
                            className="rounded-full border border-[#e5d6c5] bg-white px-3 py-1 text-xs font-semibold text-[#1a2732] focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                          >
                            <option value="socio">Sócio</option>
                            <option value="admin">Administrador</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {importPreview.new_rows.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-sm text-[#5b6b78]">
                          Nenhum novo usuário identificado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {previewTab === "complementos" && (
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 bg-white text-[10px] uppercase tracking-[0.2em] text-[#1f6dd1]">
                    <tr>
                      <th className="px-3 py-2">Nome</th>
                      <th className="px-3 py-2">E-mail</th>
                      <th className="px-3 py-2">Campos faltantes</th>
                      <th className="px-3 py-2">Dados do arquivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.completion_rows.map((row) => (
                      <tr key={`completion-${row.email}`} className="border-t border-[#f0e4d7]">
                        <td className="px-3 py-2 font-semibold text-[#1a2732]">{row.name}</td>
                        <td className="px-3 py-2">{row.email}</td>
                        <td className="px-3 py-2">{row.missing_fields.join(", ") || "-"}</td>
                        <td className="px-3 py-2">
                          {[row.city, row.uf, row.profession].filter(Boolean).join(" · ") || "Sem complemento"}
                        </td>
                      </tr>
                    ))}
                    {importPreview.completion_rows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-center text-sm text-[#5b6b78]">
                          Nenhum usuário com dados faltantes para complementar.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {previewTab === "exclusao" && (
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 bg-white text-[10px] uppercase tracking-[0.2em] text-[#ff6b6b]">
                    <tr>
                      <th className="px-3 py-2">Nome</th>
                      <th className="px-3 py-2">E-mail</th>
                      <th className="px-3 py-2">Profissão</th>
                      <th className="px-3 py-2">Ação direta</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.missing_in_file.map((user) => (
                      <tr key={`missing-${user.id}`} className="border-t border-[#f0e4d7]">
                        <td className="px-3 py-2 font-semibold text-[#1a2732]">{user.name}</td>
                        <td className="px-3 py-2">{user.email}</td>
                        <td className="px-3 py-2">{user.profession || "-"}</td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewModalOpen(false);
                              setDeleteUser(user);
                              setDeleteError(null);
                            }}
                            className="rounded-full border border-[#ff6b6b]/35 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ff6b6b] transition hover:bg-[#ffe3e3]"
                          >
                            Excluir agora
                          </button>
                        </td>
                      </tr>
                    ))}
                    {importPreview.missing_in_file.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-center text-sm text-[#5b6b78]">
                          Nenhum usuário pendente para exclusão.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {previewTab === "existentes" && (
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 bg-white text-[10px] uppercase tracking-[0.2em] text-[#1f6dd1]">
                    <tr>
                      <th className="px-3 py-2">Nome</th>
                      <th className="px-3 py-2">E-mail</th>
                      <th className="px-3 py-2">Cidade/UF</th>
                      <th className="px-3 py-2">Profissão</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importPreview.existing_rows.map((row) => (
                      <tr key={`existing-${row.email}`} className="border-t border-[#f0e4d7]">
                        <td className="px-3 py-2 font-semibold text-[#1a2732]">{row.name}</td>
                        <td className="px-3 py-2">{row.email}</td>
                        <td className="px-3 py-2">{[row.city, row.uf].filter(Boolean).join("/") || "-"}</td>
                        <td className="px-3 py-2">{row.profession || "-"}</td>
                      </tr>
                    ))}
                    {importPreview.existing_rows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-center text-sm text-[#5b6b78]">
                          Nenhum usuário já existente neste arquivo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(editingUser && editForm)}
        title="Editar usuário"
        eyebrow="Gestão de usuários"
        iconName="edit"
        tone="primary"
        onClose={() => {
          setEditingUser(null);
          setEditForm(null);
          setEditError(null);
        }}
      >
        {editForm && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-[#2f4050]">
                Nome completo
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(event) => setEditForm({ ...editForm, name: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                />
              </label>
              <label className="text-sm font-semibold text-[#2f4050]">
                E-mail
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(event) => setEditForm({ ...editForm, email: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-[#2f4050]">
                Perfil
                <select
                  value={editForm.role}
                  onChange={(event) => setEditForm({ ...editForm, role: event.target.value as UserRole })}
                  className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                >
                  <option value="socio">Sócio</option>
                  <option value="admin">Administrador</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-[#2f4050]">
                Status
                <select
                  value={editForm.active ? "active" : "inactive"}
                  onChange={(event) => setEditForm({ ...editForm, active: event.target.value === "active" })}
                  className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-[#2f4050]">
                Cidade
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(event) => setEditForm({ ...editForm, city: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                />
              </label>
              <label className="text-sm font-semibold text-[#2f4050]">
                UF
                <input
                  type="text"
                  maxLength={2}
                  value={editForm.uf}
                  onChange={(event) => setEditForm({ ...editForm, uf: event.target.value.toUpperCase() })}
                  className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm uppercase focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                />
              </label>
              <label className="text-sm font-semibold text-[#2f4050]">
                Data de admissão
                <input
                  type="date"
                  value={editForm.admission_date}
                  onChange={(event) => setEditForm({ ...editForm, admission_date: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                />
              </label>
              <label className="text-sm font-semibold text-[#2f4050]">
                Profissão
                <input
                  type="text"
                  value={editForm.profession}
                  onChange={(event) => setEditForm({ ...editForm, profession: event.target.value })}
                  className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                />
              </label>
            </div>

            {editError && (
              <div className="rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6b6b]">
                {editError}
              </div>
            )}
            <button
              type="button"
              onClick={handleUpdateUser}
              disabled={editLoading}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {editLoading ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(passwordUser)}
        title={`Senha do usuário${passwordUser ? `: ${passwordUser.name}` : ""}`}
        eyebrow="Segurança"
        iconName="edit"
        tone="primary"
        onClose={() => {
          setPasswordUser(null);
          setPasswordValue("");
          setPasswordGenerated(false);
          setPasswordError(null);
        }}
      >
        <div className="space-y-4">
          <label className="text-sm font-semibold text-[#2f4050]">
            Nova senha
            <input
              type="text"
              autoComplete="new-password"
              value={passwordValue}
              onChange={(event) => {
                setPasswordValue(event.target.value);
                setPasswordGenerated(false);
              }}
              className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setPasswordValue(generatePassword());
                setPasswordGenerated(true);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
            >
              Gerar senha temporária
            </button>
            <button
              type="button"
              onClick={handlePasswordUpdate}
              disabled={passwordLoading}
              className="inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {passwordLoading ? "Salvando..." : "Salvar senha"}
            </button>
          </div>
          {passwordGenerated && (
            <div className="rounded-2xl border border-[#1f6dd1]/30 bg-[#f2f6ff] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#1f6dd1]">
              Senha temporária gerada. Copie e compartilhe com o usuário.
            </div>
          )}
          {passwordError && (
            <div className="rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6b6b]">
              {passwordError}
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteUser)}
        title="Excluir usuário"
        eyebrow="Confirmação"
        iconName="info"
        tone="coral"
        onClose={() => {
          setDeleteUser(null);
          setDeleteError(null);
        }}
      >
        <div className="space-y-4">
          <p className="text-sm text-[#3b4b5a]">Tem certeza que deseja excluir este usuário? Essa ação é irreversível.</p>
          {deleteError && (
            <div className="rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6b6b]">
              {deleteError}
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setDeleteUser(null);
                setDeleteError(null);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDeleteUser}
              disabled={deleteLoading}
              className="inline-flex items-center gap-2 rounded-full bg-[#ff6b6b] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#e85b5b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {deleteLoading ? "Excluindo..." : "Excluir usuário"}
            </button>
          </div>
        </div>
      </Modal>
    </PortalShell>
  );
}
