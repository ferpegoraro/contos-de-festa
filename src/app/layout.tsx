import type { Metadata } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import { Header, ConditionalFooter } from "@/components/layout";
import { WhatsAppFab } from "@/components/shared/whatsapp-fab";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Contos de Festa | Pegue & Monte",
    template: "%s | Contos de Festa",
  },
  description:
    "Aluguel de kits de decoração para festas. Escolha seu kit, monte seu orçamento e envie pelo WhatsApp. Pegue e monte sua festa dos sonhos!",
  keywords: [
    "peg e monte",
    "decoração de festas",
    "aluguel de decoração",
    "kit festa",
    "festa infantil",
    "decoração aniversário",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${playfair.variable} ${nunito.variable}`}>
        <Header />
        <main>{children}</main>
        <ConditionalFooter />
        <WhatsAppFab />
      </body>
    </html>
  );
}
