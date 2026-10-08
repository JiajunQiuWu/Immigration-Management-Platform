import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { locales, type Locale } from "@/i18n/request";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const activeLocale = locale as Locale;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider
      key={activeLocale}
      locale={activeLocale}
      messages={messages}
    >
      {children}
    </NextIntlClientProvider>
  );
}