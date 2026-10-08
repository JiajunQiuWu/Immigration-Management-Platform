"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const t = useTranslations();
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const registrationSuccess = useAuthStore((state) => state.registrationSuccess);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await api.post<{ accessToken: string }>("/auth/login", {
        email,
        password,
      });
      setSession(response.data.accessToken, { email });
      router.push("/dashboard");
    } catch {
      setError(t("login.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f4f6f2] lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-[#173d3b] px-12 py-12 text-[#f4f6f2] lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-[38px] border-[#d9a441]/30" />
        <div className="absolute bottom-24 left-[-7rem] h-64 w-64 rounded-full border-[30px] border-[#e1714f]/25" />
        <div className="relative flex items-center gap-3 text-lg font-semibold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d9a441] text-[#173d3b]">T</span>
          {t("common.brand")}
        </div>
        <div className="relative max-w-xl pb-16">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.24em] text-[#d9a441]">{t("login.eyebrow")}</p>
          <h1 className="font-serif text-5xl leading-[1.04] tracking-[-0.04em] xl:text-7xl">{t("login.title")}</h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-[#c8d6d0]">{t("login.description")}</p>
        </div>
        <p className="relative text-sm text-[#9db6ac]">© 2026 Tramita</p>
      </section>

      <section className="flex min-h-screen flex-col px-6 py-6 sm:px-10 lg:px-20 lg:py-10">
        <header className="flex items-center justify-between lg:justify-end">
          <div className="flex items-center gap-2 text-lg font-semibold text-[#173d3b] lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#d9a441] text-sm">T</span>
            {t("common.brand")}
          </div>
          <LanguageSwitcher />
        </header>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <div className="mb-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#e1714f]">{t("login.eyebrow")}</p>
            <h2 className="font-serif text-4xl tracking-[-0.03em] text-[#173d3b]">{t("login.submit")}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {registrationSuccess && (
              <p role="status" className="rounded-lg bg-[#e3f1e6] px-4 py-3 text-sm text-[#367145]">
                {t("register.success")}
              </p>
            )}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#304941]">{t("login.email")}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#769087]" size={18} aria-hidden="true" />
                <input id="email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("login.emailPlaceholder")} className="h-13 w-full rounded-xl border border-[#d6dfd8] bg-white pl-11 pr-4 text-[#173d3b] outline-none transition focus:border-[#d9a441] focus:ring-4 focus:ring-[#d9a441]/15" />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#304941]">{t("login.password")}</label>
              <div className="relative">
                <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#769087]" size={18} aria-hidden="true" />
                <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t("login.passwordPlaceholder")} className="h-13 w-full rounded-xl border border-[#d6dfd8] bg-white pl-11 pr-4 text-[#173d3b] outline-none transition focus:border-[#d9a441] focus:ring-4 focus:ring-[#d9a441]/15" />
              </div>
            </div>
            {error && <p role="alert" className="rounded-lg bg-[#fce9e3] px-4 py-3 text-sm text-[#a33f2d]">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#173d3b] px-5 font-semibold text-white transition hover:bg-[#245652] disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? <LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> : <>{t("login.submit")}<ArrowRight size={18} aria-hidden="true" /></>}
              {isSubmitting && t("login.submitting")}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-[#71847b]">{t("login.noAccount")} <Link href="/register" className="font-semibold text-[#e1714f] hover:underline">{t("login.register")}</Link></p>
        </div>
      </section>
    </main>
  );
}