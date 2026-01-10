"use client";

import { useEffect, useState } from "react";
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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

type EditUserPayload = {
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
};

type BulkResult = {
  processed: number;
  created?: number;
  deleted?: number;
  skipped: number;
  errors: { row: number; message: string }[];
};

export default function PortalAdminUsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<CreateUserPayload>({
    name: "",
    email: "",
    password: "",
    role: "socio",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditUserPayload | null>(null);
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
  const [bulkCreateFile, setBulkCreateFile] = useState<File | null>(null);
  const [bulkDeleteFile, setBulkDeleteFile] = useState<File | null>(null);
  const [bulkCreateResult, setBulkCreateResult] = useState<BulkResult | null>(null);
  const [bulkDeleteResult, setBulkDeleteResult] = useState<BulkResult | null>(null);
  const [bulkCreateError, setBulkCreateError] = useState<string | null>(null);
  const [bulkDeleteError, setBulkDeleteError] = useState<string | null>(null);
  const [bulkCreateLoading, setBulkCreateLoading] = useState(false);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const [templateError, setTemplateError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const data = await apiFetch<User[]>("/admin/users");
      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

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

    try {
      await apiFetch<User>("/admin/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ name: "", email: "", password: "", role: "socio" });
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
        body: JSON.stringify(editForm),
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

  const handleDownloadTemplate = async (type: "create" | "delete") => {
    setTemplateError(null);
    try {
      const response = await fetch(`${API_BASE}/admin/users/templates/${type}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Erro ao baixar o modelo.");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = type === "create" ? "modelo-usuarios-criacao.xlsx" : "modelo-usuarios-exclusao.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao baixar o modelo.";
      setTemplateError(message);
    }
  };

  const handleBulkCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!bulkCreateFile) {
      setBulkCreateError("Selecione um arquivo Excel para criação em massa.");
      return;
    }
    setBulkCreateLoading(true);
    setBulkCreateError(null);
    setBulkCreateResult(null);

    const formData = new FormData();
    formData.append("file", bulkCreateFile);

    try {
      const result = await apiFetch<BulkResult>("/admin/users/bulk-create", {
        method: "POST",
        body: formData,
      });
      setBulkCreateResult(result);
      setBulkCreateFile(null);
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao importar usuários.";
      setBulkCreateError(message);
    } finally {
      setBulkCreateLoading(false);
    }
  };

  const handleBulkDelete = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!bulkDeleteFile) {
      setBulkDeleteError("Selecione um arquivo Excel para exclusão em massa.");
      return;
    }
    setBulkDeleteLoading(true);
    setBulkDeleteError(null);
    setBulkDeleteResult(null);

    const formData = new FormData();
    formData.append("file", bulkDeleteFile);

    try {
      const result = await apiFetch<BulkResult>("/admin/users/bulk-delete", {
        method: "POST",
        body: formData,
      });
      setBulkDeleteResult(result);
      setBulkDeleteFile(null);
      await loadUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao excluir usuários.";
      setBulkDeleteError(message);
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  return (
    <PortalShell role="admin" loginPath="/portal-admin/login" title="Portal Administrativo" links={NAV_LINKS}>
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Gestão de usuários</div>
          <h1 className="mt-3 text-3xl font-bold text-[#1a2732]">Controle de acessos</h1>
          <p className="mt-3 text-sm text-[#5b6b78]">
            Crie acessos administrativos ou de sócio, e mantenha o controle de permissões.
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
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Importação em massa</div>
              <h2 className="mt-2 text-2xl font-bold text-[#1a2732]">Usuários em lote</h2>
              <p className="mt-2 text-sm text-[#5b6b78]">
                Baixe o modelo Excel, preencha conforme o padrão e envie para criar ou excluir usuários em massa.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleDownloadTemplate("create")}
                className="inline-flex items-center gap-2 rounded-full border border-[#1f6dd1]/30 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1] transition hover:-translate-y-0.5 hover:bg-[#f2f6ff]"
              >
                Baixar modelo de criação
              </button>
              <button
                type="button"
                onClick={() => handleDownloadTemplate("delete")}
                className="inline-flex items-center gap-2 rounded-full border border-[#ff6b6b]/40 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#ff6b6b] transition hover:-translate-y-0.5 hover:bg-[#ffe3e3]"
              >
                Baixar modelo de exclusão
              </button>
            </div>
          </div>
          {templateError && (
            <div className="mt-4 rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6b6b]">
              {templateError}
            </div>
          )}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <form
              onSubmit={handleBulkCreate}
              className="rounded-3xl border border-[#e5d6c5] bg-white/80 p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">
                Criação em massa
              </div>
              <label className="mt-4 block text-sm font-semibold text-[#2f4050]">
                Arquivo Excel (.xlsx)
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(event) => {
                    setBulkCreateFile(event.target.files?.[0] ?? null);
                    setBulkCreateError(null);
                    setBulkCreateResult(null);
                  }}
                  className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#1f6dd1] focus:outline-none focus:ring-2 focus:ring-[#1f6dd1]/20"
                />
              </label>
              {bulkCreateFile && (
                <div className="mt-2 text-xs text-[#5b6b78]">Selecionado: {bulkCreateFile.name}</div>
              )}
              {bulkCreateError && (
                <div className="mt-4 rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6b6b]">
                  {bulkCreateError}
                </div>
              )}
              <button
                type="submit"
                disabled={bulkCreateLoading}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1f6dd1] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#1659ae] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {bulkCreateLoading ? "Importando..." : "Importar criação"}
              </button>
              {bulkCreateResult && (
                <div className="mt-4 rounded-2xl border border-[#1f6dd1]/30 bg-[#f2f6ff] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#1f6dd1]">
                  Criados: {bulkCreateResult.created ?? 0} · Processados: {bulkCreateResult.processed} · Erros:{" "}
                  {bulkCreateResult.errors.length}
                </div>
              )}
              {bulkCreateResult && bulkCreateResult.errors.length > 0 && (
                <div className="mt-3 rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs text-[#ff6b6b]">
                  {bulkCreateResult.errors.slice(0, 5).map((item) => (
                    <div key={`${item.row}-${item.message}`}>Linha {item.row}: {item.message}</div>
                  ))}
                  {bulkCreateResult.errors.length > 5 && (
                    <div className="mt-2">+ {bulkCreateResult.errors.length - 5} erros</div>
                  )}
                </div>
              )}
            </form>

            <form
              onSubmit={handleBulkDelete}
              className="rounded-3xl border border-[#e5d6c5] bg-white/80 p-5"
            >
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ff6b6b]">
                Exclusão em massa
              </div>
              <label className="mt-4 block text-sm font-semibold text-[#2f4050]">
                Arquivo Excel (.xlsx)
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={(event) => {
                    setBulkDeleteFile(event.target.files?.[0] ?? null);
                    setBulkDeleteError(null);
                    setBulkDeleteResult(null);
                  }}
                  className="mt-2 w-full rounded-2xl border border-[#e5d6c5] bg-white/90 px-4 py-3 text-sm focus:border-[#ff6b6b] focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]/20"
                />
              </label>
              {bulkDeleteFile && (
                <div className="mt-2 text-xs text-[#5b6b78]">Selecionado: {bulkDeleteFile.name}</div>
              )}
              {bulkDeleteError && (
                <div className="mt-4 rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6b6b]">
                  {bulkDeleteError}
                </div>
              )}
              <button
                type="submit"
                disabled={bulkDeleteLoading}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#ff6b6b] px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:-translate-y-0.5 hover:bg-[#e85b5b] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {bulkDeleteLoading ? "Excluindo..." : "Importar exclusão"}
              </button>
              {bulkDeleteResult && (
                <div className="mt-4 rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#ff6b6b]">
                  Excluídos: {bulkDeleteResult.deleted ?? 0} · Processados: {bulkDeleteResult.processed} · Erros:{" "}
                  {bulkDeleteResult.errors.length}
                </div>
              )}
              {bulkDeleteResult && bulkDeleteResult.errors.length > 0 && (
                <div className="mt-3 rounded-2xl border border-[#ff6b6b]/30 bg-[#ffe3e3] px-4 py-3 text-xs text-[#ff6b6b]">
                  {bulkDeleteResult.errors.slice(0, 5).map((item) => (
                    <div key={`${item.row}-${item.message}`}>Linha {item.row}: {item.message}</div>
                  ))}
                  {bulkDeleteResult.errors.length > 5 && (
                    <div className="mt-2">+ {bulkDeleteResult.errors.length - 5} erros</div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-lg shadow-[#1f6dd1]/10">
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f6dd1]">Usuários cadastrados</div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.2em] text-[#1f6dd1]">
                <tr>
                  <th className="py-2 pr-4">Nome</th>
                  <th className="py-2 pr-4">E-mail</th>
                  <th className="py-2 pr-4">Perfil</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2">Ações</th>
                </tr>
              </thead>
              <tbody className="text-[#3b4b5a]">
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-[#f0e4d7]">
                    <td className="py-3 pr-4 font-semibold text-[#1a2732]">{user.name}</td>
                    <td className="py-3 pr-4">{user.email}</td>
                    <td className="py-3 pr-4">{user.role === "admin" ? "Administrador" : "Sócio"}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                          user.active ? "bg-[#e6f0ff] text-[#1f6dd1]" : "bg-[#ffe3e3] text-[#ff6b6b]"
                        }`}
                      >
                        {user.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEditUser(user)}
                          className="rounded-full border border-[#1f6dd1]/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f6dd1] transition hover:bg-[#f2f6ff]"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => openPasswordModal(user, "edit")}
                          className="rounded-full border border-[#1f6dd1]/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f6dd1] transition hover:bg-[#f2f6ff]"
                        >
                          Editar senha
                        </button>
                        <button
                          type="button"
                          onClick={() => openPasswordModal(user, "reset")}
                          className="rounded-full border border-[#ff6b6b]/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b6b] transition hover:bg-[#ffe3e3]"
                        >
                          Resetar senha
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleActive(user)}
                          className="rounded-full border border-[#1f6dd1]/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f6dd1] transition hover:bg-[#f2f6ff]"
                        >
                          {user.active ? "Desativar" : "Ativar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteUser(user);
                            setDeleteError(null);
                          }}
                          className="rounded-full border border-[#ff6b6b]/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#ff6b6b] transition hover:bg-[#ffe3e3]"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td className="py-4 text-sm text-[#5b6b78]" colSpan={5}>
                      Nenhum usuário cadastrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
          <p className="text-sm text-[#3b4b5a]">
            Tem certeza que deseja excluir este usuário? Essa ação é irreversível.
          </p>
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
