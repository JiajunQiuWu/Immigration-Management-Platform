'use client';

import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardList,
  FilePlus2,
  ShieldCheck,
} from "lucide-react";
import { isAxiosError } from "axios";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NewProcedureModal } from "@/components/NewProcedureModal";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

type Procedure = {
  id: string;
  procedureCode?: string;
  title?: string;
  status?: string;
  createdAt?: string;
};

type ProcedureResponse = Procedure[] | {
  procedures?: Procedure[];
  data?: Procedure[];
};

export default function LocaleHomePage() {
  const t = useTranslations("portal");
  const tCommon = useTranslations("common");
  const tDashboard = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const { token, hasHydrated, user, logout } = useAuthStore();
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProcedures = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await api.get<ProcedureResponse>("/user/procedures");
      const responseData = response.data;
      const data = Array.isArray(responseData)
        ? responseData
        : responseData?.data || responseData?.procedures || [];
      setProcedures(Array.isArray(data) ? data : []);
      setError(null);
    } catch (requestError: unknown) {
      setError(
        isAxiosError(requestError) && requestError.response?.status === 401
          ? tDashboard("unauthorizedError")
          : t("loadError"),
      );
    } finally {
      setIsLoading(false);
    }
  }, [t, tDashboard, token]);

  useEffect(() => {
    if (!hasHydrated || !token) return;
    void Promise.resolve().then(() => fetchProcedures());
  }, [fetchProcedures, hasHydrated, token]);

  const totalInProgress = procedures.filter(
    (procedure) => procedure.status === "in_review" || procedure.status === "in_progress",
  ).length;
  const totalCompleted = procedures.filter(
    (procedure) => procedure.status === "approved" || procedure.status === "completed",
  ).length;
  const recentProcedures = procedures.slice(0, 3);

  function handleNewProcedure() {
    if (!token) {
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <main className="min-h-screen bg-[#f4f6f2] text-[#173d3b]">
      <header className="border-b border-[#dce5dc] bg-[#f8faf7] px-5 py-4 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d9a441] text-[#173d3b]">T</span>
            {tCommon("brand")}
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            {token && (
              <Link href="/dashboard" className="hidden text-sm font-semibold text-[#52665f] hover:text-[#173d3b] sm:inline">
                {tCommon("navigation.dashboard")}
              </Link>
            )}
            <LanguageSwitcher />
            {token ? (
              <button onClick={handleLogout} className="text-sm font-semibold text-[#52665f] hover:text-[#e1714f]">
                {tCommon("logout")}
              </button>
            ) : (
              <Link href="/login" className="text-sm font-semibold text-[#52665f] hover:text-[#173d3b]">
                {t("signIn")}
              </Link>
            )}
          </nav>
        </div>
      </header>

      <section className="bg-[#173d3b] px-5 py-12 text-[#f4f6f2] sm:px-10 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_280px] lg:items-end">
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#e8c777]">
              <ShieldCheck size={17} aria-hidden="true" />
              {t("eyebrow")}
            </p>
            <h1 className="max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#c8d6d0] sm:text-lg">
              {user?.email || t("description")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleNewProcedure}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d9a441] px-5 py-3 font-semibold text-[#173d3b] transition hover:bg-[#e5b85d]"
              >
                <FilePlus2 size={18} aria-hidden="true" />
                {t("newProcedure")}
              </button>
              <Link
                href={token ? "/dashboard" : "/login"}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <ClipboardList size={18} aria-hidden="true" />
                {t("viewProcedures")}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="hidden border-l border-white/20 pl-7 lg:block">
            <p className="text-sm text-[#a9c0b6]">{t("statsTitle")}</p>
            <p className="mt-2 font-serif text-5xl">{hasHydrated && token ? procedures.length : "—"}</p>
            <p className="mt-1 text-sm text-[#c8d6d0]">{t("total")}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-10">
        <div className="grid border-y border-[#dce5dc] sm:grid-cols-3">
          <article className="border-b border-[#dce5dc] py-5 sm:border-b-0 sm:py-6 sm:pr-6">
            <p className="text-sm text-[#71847b]">{t("total")}</p>
            <p className="mt-2 font-serif text-4xl">{token && hasHydrated ? procedures.length : "—"}</p>
          </article>
          <article className="border-b border-[#dce5dc] py-5 sm:border-b-0 sm:border-l sm:px-6 sm:py-6">
            <p className="text-sm text-[#71847b]">{t("inProgress")}</p>
            <p className="mt-2 font-serif text-4xl text-[#3971a1]">{token && hasHydrated ? totalInProgress : "—"}</p>
          </article>
          <article className="py-5 sm:border-l sm:border-[#dce5dc] sm:py-6 sm:pl-6">
            <p className="text-sm text-[#71847b]">{t("completed")}</p>
            <p className="mt-2 font-serif text-4xl text-[#438056]">{token && hasHydrated ? totalCompleted : "—"}</p>
          </article>
        </div>

        {error && <p role="alert" className="mt-5 rounded-lg bg-[#fce9e3] px-4 py-3 text-sm text-[#a33f2d]">{error}</p>}

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <section aria-labelledby="guide-heading">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e1714f]">{t("eyebrow")}</p>
            <h2 id="guide-heading" className="font-serif text-3xl">{t("guides")}</h2>
            <div className="mt-6 divide-y divide-[#dce5dc] border-y border-[#dce5dc]">
              <article className="py-5">
                <h3 className="font-semibold">{t("renewalQuestion")}</h3>
                <p className="mt-2 text-sm leading-6 text-[#64766e]">{t("renewalAnswer")}</p>
              </article>
              <article className="py-5">
                <h3 className="font-semibold">{t("responseQuestion")}</h3>
                <p className="mt-2 text-sm leading-6 text-[#64766e]">{t("responseAnswer")}</p>
              </article>
            </div>
          </section>

          <section aria-labelledby="recent-heading">
            <div className="flex items-end justify-between gap-4 border-b border-[#dce5dc] pb-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e1714f]">{t("statsTitle")}</p>
                <h2 id="recent-heading" className="font-serif text-3xl">{t("recent")}</h2>
              </div>
              <Link href={token ? "/dashboard" : "/login"} className="inline-flex items-center gap-1 text-sm font-semibold text-[#3971a1] hover:underline">
                {t("seeAll")}<ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
            {isLoading ? (
              <div className="space-y-3 py-5" aria-label={tCommon("loading")}>
                {[0, 1, 2].map((item) => <div key={item} className="h-16 animate-pulse rounded-lg bg-[#e7ece7]" />)}
              </div>
            ) : recentProcedures.length > 0 ? (
              <ul className="divide-y divide-[#dce5dc]">
                {recentProcedures.map((procedure) => (
                  <li key={procedure.id} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{procedure.procedureCode || procedure.title || tDashboard("procedureCode")}</p>
                      <p className="mt-1 text-xs text-[#71847b]">
                        {procedure.createdAt ? new Date(procedure.createdAt).toLocaleDateString(locale, { dateStyle: "medium" }) : tDashboard("unknownDate")}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#edf1ed] px-3 py-1 text-xs font-semibold text-[#52665f]">
                      {procedure.status ? tDashboard(`status.${procedure.status}`) : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-sm text-[#71847b]">
                {!token && <Link href="/login" className="mt-3 inline-block font-semibold text-[#3971a1] hover:underline">{t("signIn")}</Link>}
              </div>
            )}
          </section>
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
