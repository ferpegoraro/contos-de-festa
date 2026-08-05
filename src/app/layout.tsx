import type { Metadata } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import { Toaster } from "sonner";
import { Header, ConditionalFooter } from "@/components/layout";
import { WhatsAppFab } from "@/components/shared/whatsapp-fab";
import { QuoteProvider } from "@/contexts/quote-context";
import { AuthProvider } from "@/contexts/auth-context";
import { QuoteCart } from "@/components/kits";
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

// Fixo/estático de propósito: ler runtime vars (VERCEL_URL) aqui faria a
// Vercel renderizar TODAS as páginas sob demanda (uma função por rota →
// estoura o limite do plano free). NEXT_PUBLIC_* é embutido no build.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://contosdefesta.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Contos de Festa",
    title: "Contos de Festa | Pegue & Monte",
    description:
      "Aluguel de kits de decoração para festas. Escolha, monte e encante.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contos de Festa | Pegue & Monte",
    description:
      "Aluguel de kits de decoração para festas. Escolha, monte e encante.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${playfair.variable} ${nunito.variable}`}>
        <AuthProvider>
          <QuoteProvider>
            <Header />
            <main>{children}</main>
            <ConditionalFooter />
            <QuoteCart />
            <WhatsAppFab />
            <Toaster
              richColors
              position="bottom-right"
              toastOptions={{
                style: { fontFamily: "var(--font-body)" },
              }}
            />
          </QuoteProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
