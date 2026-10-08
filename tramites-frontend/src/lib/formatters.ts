import type { Locale } from "@/i18n/request";

const regionalSettings: Record<Locale, { currency: string; timeZone: string }> = {
  es: { currency: "EUR", timeZone: "Europe/Madrid" },
  zh: { currency: "CNY", timeZone: "Asia/Shanghai" },
};

export function formatDate(value: string | number | Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: regionalSettings[locale].timeZone,
  }).format(new Date(value));
}

export function formatTime(value: string | number | Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    timeStyle: "short",
    timeZone: regionalSettings[locale].timeZone,
  }).format(new Date(value));
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: regionalSettings[locale].currency,
  }).format(value);
}