import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorias",
  description:
    "Navegue por tipo de evento — aniversário, chá de bebê, casamento e mais. Encontre o kit ideal para sua festa.",
  openGraph: {
    title: "Categorias | Contos de Festa",
    description: "Navegue por tipo de evento e encontre o kit ideal.",
  },
};

export default function CategoriasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
