import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Kits",
  description:
    "Conheça nossos kits de decoração para festas — pegue, monte e encante. Filtre por categoria e tipo de kit.",
  openGraph: {
    title: "Catálogo de Kits | Contos de Festa",
    description:
      "Conheça nossos kits de decoração para festas — pegue, monte e encante.",
  },
};

export default function KitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
