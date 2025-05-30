"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MoonIcon, SunIcon, ChevronLeftIcon, ChevronRightIcon, UsersIcon, CreditCardIcon, LayoutDashboardIcon, SettingsIcon, PackageIcon, LogOutIcon, BellIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCollapsed: boolean;
  badge?: string;
}

const NavItem = ({ href, label, icon, isActive, isCollapsed, badge }: NavItemProps) => {
  return (
    <Link href={href} className="w-full">
      <motion.div
        className={cn(
          "flex items-center rounded-lg py-3 px-3.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary/10 text-primary hover:bg-primary/20"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={cn("mr-2 h-5 w-5", isActive ? "text-primary" : "")}>
          {icon}
        </div>
        {!isCollapsed && (
          <div className="flex flex-1 items-center justify-between">
            <span>{label}</span>
            {badge && (
              <Badge variant="secondary" className="ml-2">
                {badge}
              </Badge>
            )}
          </div>
        )}
      </motion.div>
    </Link>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  // Información del administrador
  const admin = {
    name: "Carlos Rodríguez",
    role: "Administrador",
    avatar: "/admin/avatar.jpg",
  };

  // Elementos de navegación
  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboardIcon className="h-5 w-5" />,
      badge: "",
    },
    {
      href: "/usuarios",
      label: "Usuarios",
      icon: <UsersIcon className="h-5 w-5" />,
      badge: "145",
    },
    {
      href: "/creditos",
      label: "Créditos",
      icon: <CreditCardIcon className="h-5 w-5" />,
      badge: "",
    },
    {
      href: "/planes",
      label: "Planes",
      icon: <PackageIcon className="h-5 w-5" />,
      badge: "",
    },
    {
      href: "/configuracion",
      label: "Configuración",
      icon: <SettingsIcon className="h-5 w-5" />,
      badge: "",
    },
  ];

  const sidebarVariants = {
    expanded: { width: 250 },
    collapsed: { width: 80 },
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar con animación */}
      <motion.aside
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative flex h-screen flex-col border-r bg-card px-2 py-4"
      >
        {/* Logo y botón de colapsar */}
        <div className="flex items-center justify-between px-2">
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center"
            >
              <div className="mr-2 h-8 w-8 rounded-md bg-primary"></div>
              <h1 className="text-lg font-bold text-primary">Reputación</h1>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expandir panel" : "Colapsar panel"}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <Separator className="my-4" />

        {/* Navegación */}
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
              badge={item.badge}
            />
          ))}
        </nav>

        <div className="mt-auto space-y-4 px-2">
          <Separator />
          
          {/* Botón de tema */}
          {mounted && (
            <Button
              variant="outline"
              size={isCollapsed ? "icon" : "default"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full justify-start"
            >
              {theme === "dark" ? (
                <>
                  <SunIcon className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-2">Modo Claro</span>}
                </>
              ) : (
                <>
                  <MoonIcon className="h-5 w-5" />
                  {!isCollapsed && <span className="ml-2">Modo Oscuro</span>}
                </>
              )}
            </Button>
          )}

          {/* Perfil de administrador */}
          <div className="flex items-center justify-between rounded-lg border p-2">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={admin.avatar} alt={admin.name} />
                <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="ml-2">
                  <p className="text-sm font-medium">{admin.name}</p>
                  <p className="text-xs text-muted-foreground">{admin.role}</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/logout">
                  <LogOutIcon className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Contenido principal */}
      <div className="flex-1 overflow-auto">
        {/* Barra superior */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
          <h1 className="text-xl font-semibold">
            {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <BellIcon className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Contenido de la página */}
        <motion.main 
          className="p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
