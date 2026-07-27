"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User as UserIcon,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { ApiError } from "@/lib/api/client";
import { siteConfig } from "@/constants/site";

const perks = [
  {
    icon: Sparkles,
    title: "Acesso completo",
    description: "Crie kits, edite valores e gerencie todo o catálogo.",
    color: "#e8a0b4",
  },
  {
    icon: ShieldCheck,
    title: "Login seguro",
    description: "Cookie httpOnly, JWT e CORS restrito desde o primeiro acesso.",
    color: "#fce8ef",
  },
  {
    icon: KeyRound,
    title: "Convite por código",
    description: "Só quem tem o código de acesso da proprietária entra aqui.",
    color: "#9b3a5a",
  },
];

export default function RegisterPage() {
  return (
    <div
      data-theme="dark"
      className="relative min-h-screen overflow-hidden bg-[#2d1a22]"
    >
      <AuthBackdrop />

      <div className="relative z-10 min-h-screen grid lg:grid-cols-12">
        <BrandShowcase />
        <FormPanel />
      </div>
    </div>
  );
}

function AuthBackdrop() {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-[#722e43] via-[#5a2435] to-[#2d1a22]" />

      <div
        className="fixed inset-0 bg-[url('/logo-transparente.png')] bg-center bg-no-repeat opacity-[0.025]"
        style={{ backgroundSize: "640px" }}
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-[520px] h-[520px] bg-[#e8a0b4]/20 rounded-full blur-3xl will-change-transform"
          animate={{ y: [0, 40, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-32 -right-20 w-[560px] h-[560px] bg-[#e8a0b4]/12 rounded-full blur-3xl will-change-transform"
          animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[760px] bg-[#9b3a5a]/18 rounded-full blur-3xl will-change-transform"
          animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="fixed inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />

      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#2d1a22] via-[#2d1a22]/80 to-transparent pointer-events-none" />
    </>
  );
}

function BrandShowcase() {
  return (
    <aside className="hidden lg:flex lg:col-span-7 relative px-12 xl:px-20 py-16 flex-col justify-between">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Link href="/login" className="inline-flex items-center gap-3 group">
          <ArrowLeft className="w-4 h-4 text-white/50 group-hover:text-white group-hover:-translate-x-1 transition-all" />
          <span className="text-sm font-body text-white/60 group-hover:text-white transition-colors">
            voltar para o login
          </span>
        </Link>
      </motion.div>

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-5 mb-10"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-2xl scale-150" />
            <Image
              src="/logo-transparente.png"
              alt={siteConfig.name}
              width={92}
              height={92}
              className="relative drop-shadow-2xl"
              priority
            />
          </div>
          <div>
            <p className="font-heading text-4xl xl:text-5xl font-bold text-white drop-shadow-md leading-none">
              {siteConfig.name}
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Sparkles className="w-3.5 h-3.5 text-[#e8a0b4]" />
              <span className="text-sm font-body text-[#e8a0b4] tracking-widest uppercase">
                {siteConfig.tagline}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="font-heading text-3xl xl:text-4xl font-bold text-white leading-tight max-w-xl"
        >
          Crie sua conta de{" "}
          <span className="text-[#e8a0b4]">administradora</span> e dê vida ao
          catálogo.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          className="text-base text-white/60 font-body mt-5 max-w-md leading-relaxed"
        >
          O cadastro precisa do código de acesso fornecido pela proprietária.
          Sem ele, o painel fica fechado — assim a vitrine fica só com quem
          deve.
        </motion.p>

        <ul className="mt-12 space-y-4 max-w-md">
          {perks.map((item, i) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="group flex items-start gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/20 transition-all duration-500"
            >
              <div
                className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${item.color}1f` }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div>
                <p className="font-heading font-semibold text-white">
                  {item.title}
                </p>
                <p className="text-sm text-white/55 font-body leading-relaxed mt-0.5">
                  {item.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="flex items-center gap-2 text-xs text-white/40 font-body"
      >
        <ShieldCheck className="w-4 h-4 text-[#e8a0b4]/60" />
        Sessão protegida · cookie httpOnly · CORS restrito
      </motion.div>
    </aside>
  );
}

function FormPanel() {
  return (
    <section className="lg:col-span-5 relative flex items-center justify-center px-4 sm:px-6 py-12 lg:py-16">
      <div className="absolute inset-y-0 -left-px w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />

      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:hidden flex items-center justify-center gap-3 mb-10"
        >
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/40 transition-all duration-500" />
              <Image
                src="/logo-transparente.png"
                alt={siteConfig.name}
                width={56}
                height={56}
                className="relative drop-shadow-2xl"
              />
            </div>
            <span className="font-heading text-2xl font-bold text-white drop-shadow-md">
              {siteConfig.name}
            </span>
          </Link>
        </motion.div>

        <RegisterCard />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center text-xs text-white/30 mt-6 font-body lg:hidden"
        >
          Sessão protegida · cookie httpOnly
        </motion.p>
      </div>
    </section>
  );
}

function RegisterCard() {
  const router = useRouter();
  const { register, login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({ name, email, password, adminKey });
      await login({ email, password });
      router.push("/admin");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Não foi possível criar a conta. Tente novamente.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
      className="relative bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] p-8 sm:p-10 overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8a0b4]/70 to-transparent" />
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#e8a0b4]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="inline-flex items-center gap-2 bg-[#e8a0b4]/10 border border-[#e8a0b4]/25 px-3 py-1 rounded-full mb-5">
          <Sparkles className="w-3.5 h-3.5 text-[#e8a0b4]" />
          <span className="text-[11px] font-bold font-body text-[#e8a0b4] tracking-[0.15em] uppercase">
            Criar conta
          </span>
        </div>

        <h2 className="font-heading text-3xl font-bold text-white leading-tight">
          Comece por aqui
        </h2>
        <p className="text-sm text-white/55 mt-2 font-body leading-relaxed">
          Em minutos você está dentro do painel.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <Field
            id="name"
            label="Nome"
            icon={UserIcon}
            type="text"
            placeholder="Como você se chama"
            value={name}
            onChange={setName}
            minLength={2}
          />

          <Field
            id="email"
            label="Email"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            value={email}
            onChange={setEmail}
          />

          <Field
            id="password"
            label="Senha"
            icon={Lock}
            type="password"
            autoComplete="new-password"
            placeholder="Mínimo 10 caracteres com 1 número"
            value={password}
            onChange={setPassword}
            minLength={10}
          />

          <Field
            id="adminKey"
            label="Código de acesso"
            icon={KeyRound}
            type="password"
            placeholder="Forneça o código"
            value={adminKey}
            onChange={setAdminKey}
            tone="strong"
          />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-100 bg-red-500/10 border border-red-400/30 px-4 py-3 rounded-xl font-body"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="group relative w-full overflow-hidden bg-white text-[#722e43] hover:text-[#2d1a22] disabled:opacity-60 disabled:cursor-not-allowed font-bold font-body py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 mt-6 shadow-[0_15px_40px_-10px_rgba(232,160,180,0.6)] hover:shadow-[0_20px_50px_-10px_rgba(232,160,180,0.85)] hover:scale-[1.02] active:scale-[0.99]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#e8a0b4] to-[#9b3a5a] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative flex items-center gap-2">
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Criar conta
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </form>

        <p className="text-center text-sm text-white/45 mt-7 font-body">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="text-[#e8a0b4] hover:text-white font-semibold transition-colors"
          >
            Entrar
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  icon: LucideIcon;
  type: string;
  placeholder: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  tone?: "rose" | "strong";
}

function Field({
  id,
  label,
  icon: Icon,
  type,
  placeholder,
  autoComplete,
  value,
  onChange,
  minLength,
  tone = "rose",
}: FieldProps) {
  const accent = "#e8a0b4";
  const ringClass =
    tone === "strong"
      ? "focus:ring-[#e8a0b4]/60 focus:border-[#e8a0b4]/70 border-[#e8a0b4]/35"
      : "focus:ring-[#e8a0b4]/40 focus:border-[#e8a0b4]/40 border-white/10";

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-bold text-white/65 mb-2 font-body uppercase tracking-[0.15em]"
      >
        {label}
      </label>
      <div className="relative group">
        <Icon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
          style={{ color: `${accent}b3` }}
        />
        <input
          id={id}
          type={type}
          required
          autoComplete={autoComplete}
          value={value}
          minLength={minLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-11 pr-4 py-3.5 rounded-xl border bg-white/[0.04] text-white placeholder:text-white/25 font-body focus:outline-none focus:ring-2 hover:bg-white/[0.06] transition ${ringClass}`}
        />
      </div>
    </div>
  );
}
