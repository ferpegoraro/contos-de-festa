import type { FastifyReply } from "fastify";

/**
 * Cache para respostas públicas de leitura (catálogo).
 *
 * Faz CDN/proxy (Vercel) e o navegador guardarem a resposta por um tempinho,
 * então um pico de acessos NÃO vira um pico de requisições no backend
 * (Railway) — a maioria é servida do cache. `stale-while-revalidate` mantém o
 * site rápido enquanto revalida em segundo plano.
 *
 *   max-age=30              → navegador reusa por 30s
 *   s-maxage=60             → CDN/proxy reusa por 60s
 *   stale-while-revalidate  → serve o antigo por +5min enquanto atualiza
 */
export function setPublicCache(reply: FastifyReply): void {
  reply.header(
    "Cache-Control",
    "public, max-age=30, s-maxage=60, stale-while-revalidate=300",
  );
}
