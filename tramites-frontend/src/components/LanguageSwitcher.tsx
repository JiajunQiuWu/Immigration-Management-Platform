"use client";

import { Globe2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");

  function changeLocale(nextLocale: Locale) {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.replace(pathname, { locale: nextLocale });
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-sm text-[#52665f]">
      <Globe2 size={16} aria-hidden="true" />
      <span className="sr-only">{t("language")}</span>
      <select
        value={currentLocale}
        onChange={(event) => {
          const nextLocale = event.target.value as Locale;
          if (locales.includes(nextLocale)) changeLocale(nextLocale);
        }}
        className="cursor-pointer bg-transparent font-medium outline-none"
      >
        <option value="es">{t("spanish")}</option>
        <option value="zh">{t("chinese")}</option>
      </select>
    </label>
  );
}