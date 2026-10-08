import { getRequestConfig } from "next-intl/server";
import { locales, type Locale } from "@/i18n/routing";

export { locales };
export type { Locale };

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale;
  const locale: Locale = locales.includes(requestedLocale as Locale)
    ? (requestedLocale as Locale)
    : "es";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});