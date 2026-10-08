import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["es", "zh"],
  defaultLocale: "es",
  localePrefix: "never",
  localeDetection: true,
});

export const { locales } = routing;
export type Locale = (typeof locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);