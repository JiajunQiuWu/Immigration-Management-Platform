"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

export default function RegisterPage() {
  const t = useTranslations();
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const setRegistrationSuccess = useAuthStore((state) => state.setRegistrationSuccess);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await api.post("/auth/register", {
        email,
        password,
        preferredLanguage: params.locale,
      });
      setRegistrationSuccess(true);
      router.push("/login");
    } catch {
      setError(t("register.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f6f2] px-6 py-6 text-[#173d3b] sm:px-10">
      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/login" className="flex items-center gap-3 text-lg font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#d9a441]">T</span>
          {t("common.brand")}
        </Link>
        <LanguageSwitcher />
      </header>

      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md flex-col justify-center py-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#e1714f]">{t("register.eyebrow")}</p>
        <h1 className="font-serif text-4xl tracking-[-0.03em]">{t("register.title")}</h1>
        <p className="mt-3 mb-8 text-[#71847b]">{t("register.description")}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label htmlFor="register-email" className="block text-sm font-semibold">
            {t("register.email")}
            <span className="relative mt-2 block">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#769087]" size={18} aria-hidden="true" />
              <input id="register-email" type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("register.emailPlaceholder")} className="h-13 w-full rounded-xl border border-[#d6dfd8] bg-white pl-11 pr-4 font-normal outline-none focus:border-[#d9a441] focus:ring-4 focus:ring-[#d9a441]/15" />
            </span>
          </label>
          <label htmlFor="register-password" className="block text-sm font-semibold">
            {t("register.password")}
            <span className="relative mt-2 block">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-[#769087]" size={18} aria-hidden="true" />
              <input id="register-password" type="password" required minLength={12} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t("register.passwordPlaceholder")} className="h-13 w-full rounded-xl border border-[#d6dfd8] bg-white pl-11 pr-4 font-normal outline-none focus:border-[#d9a441] focus:ring-4 focus:ring-[#d9a441]/15" />
            </span>
          </label>
          {error && <p role="alert" className="rounded-lg bg-[#fce9e3] px-4 py-3 text-sm text-[#a33f2d]">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#173d3b] px-5 font-semibold text-white transition hover:bg-[#245652] disabled:opacity-60">
            {isSubmitting ? <LoaderCircle className="animate-spin" size={18} aria-hidden="true" /> : <>{t("register.submit")}<ArrowRight size={18} aria-hidden="true" /></>}
            {isSubmitting && t("register.submitting")}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-[#71847b]">{t("register.hasAccount")} <Link href="/login" className="font-semibold text-[#e1714f] hover:underline">{t("common.navigation.login")}</Link></p>
      </section>
    </main>
  );
}