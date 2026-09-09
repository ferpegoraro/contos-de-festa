"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Menu } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { AdminSidebar } from "@/components/admin/sidebar";

const PUBLIC_ADMIN_PATHS = new Set(["/admin/register"]);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isPublicAdminPath = PUBLIC_ADMIN_PATHS.has(pathname);

  useEffect(() => {
    if (isPublicAdminPath || isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [isPublicAdminPath, isLoading, isAuthenticated, user, pathname, router]);

  if (isPublicAdminPath) {
    return <>{children}</>;
  }

  if (isLoading || !isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div
        data-theme="dark"
        className="adm adm-shell relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <Loader2 className="relative w-6 h-6 animate-spin text-[#e8a0b4]" />
      </div>
    );
  }

  return (
    <div
      data-theme="dark"
      className="adm adm-shell relative min-h-screen flex overflow-hidden"
    >
      {/* Grão fino de papel — única textura, bem sutil */}
      <div className="adm-grain fixed inset-0 pointer-events-none" />

      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="relative flex-1 flex flex-col min-w-0 z-10">
        <header
          className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3"
          style={{
            background: "rgba(31,19,25,0.92)",
            borderBottom: "1px solid var(--line)",
            backdropFilter: "blur(8px)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-white/5"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5 text-[#f2e8ec]" />
          </button>
          <p className="font-heading font-bold text-[#f2e8ec]">Admin</p>
          <div className="w-9" />
        </header>

        <div className="flex-1 px-6 sm:px-8 lg:px-10 py-8">{children}</div>
      </div>
    </div>
  );
}
