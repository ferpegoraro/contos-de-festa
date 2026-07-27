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
        className="relative min-h-screen flex items-center justify-center bg-[#2d1a22] overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#722e43]/40 via-[#5a2435]/40 to-[#2d1a22]" />
        <Loader2 className="relative w-6 h-6 animate-spin text-[#e8a0b4]" />
      </div>
    );
  }

  return (
    <div
      data-theme="dark"
      className="relative min-h-screen flex bg-[#2d1a22] overflow-hidden"
    >
      {/* Ambient backdrop */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#722e43]/30 via-[#5a2435]/20 to-[#2d1a22]" />
        <div className="absolute -top-40 -right-32 w-[500px] h-[500px] bg-[#e8a0b4]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-[#9b3a5a]/15 rounded-full blur-3xl" />
        {/* grão fino tipo papel */}
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
        {/* vinheta sutil */}
        <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="relative flex-1 flex flex-col min-w-0 z-10">
        <header className="lg:hidden sticky top-0 z-30 bg-[#2d1a22]/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-white/5 rounded-lg"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <p className="font-heading font-bold text-white">Admin</p>
          <div className="w-9" />
        </header>

        <div className="flex-1 px-6 sm:px-8 lg:px-10 py-8">{children}</div>
      </div>
    </div>
  );
}
