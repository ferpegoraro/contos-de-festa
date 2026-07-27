"use client";

import { useIsAdminRoute } from "@/hooks/use-is-admin-route";
import { Footer } from "./footer";

export function ConditionalFooter() {
  const isAdmin = useIsAdminRoute();
  if (isAdmin) return null;
  return <Footer />;
}
