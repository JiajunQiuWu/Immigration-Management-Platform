'use client';

import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  LoaderCircle,
  LogOut,
  Plus,
  Trash2,
} from "lucide-react";
import { isAxiosError } from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NewProcedureModal } from "@/components/NewProcedureModal";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

type Procedure = {
  id: string;
  procedureCode?: string;
  title?: string;
  description?: string | null;
  status?: "pending" | "in_progress" | "completed" | "in_review" | "approved" | "rejected" | "cancelled";
  createdAt?: string;
  appointmentDate?: string | null;
  notes?: string | null;
};

type ProcedureResponse = Procedure[] | {
  procedures?: Procedure[];
  data?: Procedure[];
};

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const statusClasses: Record<string, string> = {
    pending: "bg-[#fff2d7] text-[#916a17]",
    in_review: "bg-[#dceeff] text-[#245a8d]",
    approved: "bg-[#e3f1e6] text-[#367145]",
    rejected: "bg-[#fce9e3] text-[#a33f2d]",
    cancelled: "bg-[#fce9e3] text-[#a33f2d]",
    in_progress: "bg-[#dcebea] text-[#246460]",
    completed: "bg-[#e3f1e6] text-[#367145]",
  };
  const statusLabels: Record<string, string> = {
    pending: t("status.pending"),
    in_review: t("status.in_review"),
    approved: t("status.approved"),
    rejected: t("status.rejected"),
    cancelled: t("status.cancelled"),
    in_progress: t("status.in_progress"),
    completed: t("status.completed"),
  };

  const fetchProcedures = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);

    try {
      console.log(
        "URL de la petición:",
        api.defaults.baseURL + "/user/procedures",
      );
      const response = await api.get<ProcedureResponse>("/user/procedures");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || response.data?.procedures || [];
      const dataArray = Array.isArray(data) ? data : [];

      setProcedures(dataArray);
      setError(null);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setError(error.response?.status === 401 ? t("unauthorizedError") : t("loadError"));
      } else {
        setError(t("loadError"));
      }
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [t]);

  const pendingProcedures = procedures.filter(
    (procedure) => procedure.status === "pending",
  );
  const inProgressProcedures = procedures.filter(
    (procedure) => procedure.status === "in_review" || procedure.status === "in_progress",
  );
  const completedProcedures = procedures.filter(
    (procedure) =>
      procedure.status === "completed" ||
      procedure.status === "approved" ||
      procedure.status === "rejected" ||
      procedure.status === "cancelled",
  );

  useEffect(() => {
    void Promise.resolve().then(() => fetchProcedures());
  }, [fetchProcedures]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  async function handleDeleteProcedure(id: string) {
    if (!window.confirm(t("confirmDelete"))) return;

    setDeletingId(id);
    setError(null);
    try {
      await api.delete(`/user/procedures/${id}`);
      await fetchProcedures(false);
    } catch (deleteError: unknown) {
      if (isAxiosError(deleteError) && deleteError.response?.status === 404) {
        setError(t("deleteUnavailableError"));
      } else {
        setError(t("deleteError"));
      }
    } finally {
      setDeletingId(null);
    }
  }

  async function handleMoveToProgress(id: string) {
    setUpdatingId(id);
    setError(null);
    try {
      await api.patch(`/user/procedures/${id}`, { status: "in_progress" });
      await fetchProcedures(false);
    } catch {
      setError(t("updateError"));
    } finally {
      setUpdatingId(null);
    }
  }

  function renderProcedureCard(procedure: Procedure) {
    const status = procedure.status ?? "pending";
    const procedureName = procedure.procedureCode || procedure.title || t("procedureCode");

    return (
      <article
        key={procedure.id}
        className="rounded-xl border border-[#dce5dc] bg-white p-5 shadow-[0_8px_24px_rgba(23,61,59,0.04)] transition-shadow hover:shadow-[0_12px_30px_rgba(23,61,59,0.08)]"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 break-words text-lg font-semibold text-[#173d3b]">
            {procedureName}
          </h3>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status] ?? "bg-[#edf1ed] text-[#52665f]"}`}>
            {statusLabels[status] ?? status}
          </span>
        </div>
        {(procedure.description || procedure.notes) && (
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#52665f]">
            {procedure.description || procedure.notes}
          </p>
        )}
        <div className="mt-5 flex items-center gap-2 border-t border-[#edf1ed] pt-4 text-xs text-[#71847b]">
          <CalendarDays size={14} aria-hidden="true" />
          {procedure.createdAt
            ? new Date(procedure.createdAt).toLocaleDateString(locale, { dateStyle: "medium" })
            : t("unknownDate")}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {status === "pending" && (
            <button
              type="button"
              onClick={() => void handleMoveToProgress(procedure.id)}
              disabled={updatingId === procedure.id}
              className="inline-flex items-center gap-2 rounded-lg bg-[#e7f1fb] px-3 py-2 text-sm font-semibold text-[#245a8d] transition hover:bg-[#d8e9f8] disabled:opacity-60"
            >
              {updatingId === procedure.id ? (
                <LoaderCircle className="animate-spin" size={15} aria-hidden="true" />
              ) : (
                <ArrowRight size={15} aria-hidden="true" />
              )}
              {t("moveToProgress")}
            </button>
          )}
          <button
            type="button"
            onClick={() => void handleDeleteProcedure(procedure.id)}
            disabled={deletingId === procedure.id}
            className="inline-flex items-center gap-2 rounded-lg border border-[#f0c9be] px-3 py-2 text-sm font-semibold text-[#a33f2d] transition hover:bg-[#fce9e3] disabled:cursor-wait disabled:opacity-60"
          >
            {deletingId === procedure.id ? (
              <LoaderCircle className="animate-spin" size={15} aria-hidden="true" />
            ) : (
              <Trash2 size={15} aria-hidden="true" />
            )}
            {t("delete")}
          </button>
        </div>
      </article>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f2] text-[#173d3b]">
      <header className="border-b border-[#dce5dc] bg-[#f8faf7]/90 px-5 py-5 backdrop-blur sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-lg font-semibold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d9a441]">T</span>
            {tCommon("brand")}
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-[#52665f] transition hover:text-[#e1714f]"
              title={tCommon("logout")}
            >
              <LogOut size={17} aria-hidden="true" />
              <span className="hidden sm:inline">{tCommon("logout")}</span>
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-10 sm:py-14">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#e1714f]">
              {t("eyebrow")}
            </p>
            <h1 className="font-serif text-5xl tracking-[-0.04em]">
              {t("title")}
            </h1>
            <p className="mt-3 max-w-xl text-[#71847b]">
              {user?.email || t("description")}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#173d3b] px-5 py-3 font-semibold text-white transition hover:bg-[#245652]"
          >
            <Plus size={18} aria-hidden="true" />
            {t("newProcedure")}
          </button>
        </div>

        {error && (
          <p role="alert" className="mb-6 rounded-xl bg-[#fce9e3] px-4 py-3 text-sm text-[#a33f2d]">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              id: "pending",
              title: t("kanban.pending"),
              procedures: pendingProcedures,
              headingClass: "bg-[#fff2d7] text-[#805d18]",
            },
            {
              id: "inProgress",
              title: t("kanban.inProgress"),
              procedures: inProgressProcedures,
              headingClass: "bg-[#e7f1fb] text-[#245a8d]",
            },
            {
              id: "completed",
              title: t("kanban.completed"),
              procedures: completedProcedures,
              headingClass: "bg-[#e3f1e6] text-[#367145]",
            },
          ].map((column) => (
            <section key={column.id} className="min-w-0 rounded-2xl bg-[#edf1ed] p-3 sm:p-4">
              <header className={`mb-4 flex items-center justify-between rounded-xl px-4 py-3 ${column.headingClass}`}>
                <h2 className="font-semibold">{column.title}</h2>
                <span className="grid min-h-7 min-w-7 place-items-center rounded-full bg-white/80 px-2 text-sm font-bold">
                  {column.procedures.length}
                </span>
              </header>
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 2 }, (_, index) => (
                    <div key={index} className="animate-pulse rounded-xl border border-[#dce5dc] bg-white p-5">
                      <div className="mb-4 h-4 w-2/3 rounded bg-[#e4ebe5]" />
                      <div className="h-3 w-1/2 rounded bg-[#edf1ed]" />
                    </div>
                  ))
                ) : column.procedures.length > 0 ? (
                  column.procedures.map(renderProcedureCard)
                ) : (
                  <p className="rounded-xl border border-dashed border-[#c6d4c9] px-4 py-8 text-center text-sm text-[#71847b]">
                    {t("kanban.empty")}
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </section>

      <NewProcedureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProcedures}
      />
    </main>
  );
}
