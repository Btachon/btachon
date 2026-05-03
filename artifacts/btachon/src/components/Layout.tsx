import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, BookOpen, Users, Activity, Settings, Menu, LogOut, Flame, ShieldAlert, Mail, ScrollText } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShabbosBanner } from "@/components/ShabbosBanner";
import { useAuth } from "@workspace/replit-auth-web";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/pulse", label: "Pulse", icon: Activity },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/grow", label: "Grow", icon: Flame },
  { href: "/tefillah", label: "Tefillah", icon: ScrollText },
  { href: "/chevre", label: "Connect", icon: Users },
  { href: "/blocker", label: "Blocker", icon: ShieldAlert },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavItem({ href, label, icon: Icon, isActive, onClick }: { href: string; label: string; icon: any; isActive: boolean; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick}>
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        }`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span className="font-medium text-sm">{label}</span>
      </div>
    </Link>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const userInitial = (user?.firstName?.[0] || user?.email?.[0] || "?").toUpperCase();
  const userLabel = user?.firstName || user?.email?.split("@")[0] || "Account";

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
        <div className="p-6 border-b border-border/50">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Btachon</h1>
          <p className="text-xs text-muted-foreground mt-1">Trust. Connect. Grow.</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} {...item} isActive={location === item.href} />
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-border/50 space-y-1">
          <div className="flex items-center gap-3 px-2 py-2">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt={userLabel} className="w-8 h-8 rounded-full object-cover border border-border" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
                {userInitial}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{userLabel}</div>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={logout} title="Log out">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
          <a
            href="mailto:info.btachon@gmail.com"
            className="flex items-center gap-2 px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium">Contact Support</span>
          </a>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Btachon</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-card border-l-border p-0 flex flex-col">
              <div className="p-6 border-b border-border/50">
                <h2 className="text-xl font-bold text-foreground">Btachon</h2>
                {user && (
                  <div className="flex items-center gap-2 mt-3">
                    {user.profileImageUrl ? (
                      <img src={user.profileImageUrl} alt={userLabel} className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{userInitial}</div>
                    )}
                    <span className="text-sm text-muted-foreground truncate">{userLabel}</span>
                  </div>
                )}
              </div>
              <nav className="flex flex-col space-y-1 p-4 flex-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                  <NavItem key={item.href} {...item} isActive={location === item.href} />
                ))}
              </nav>
              <div className="p-4 border-t border-border/50">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" /> Log out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 overflow-auto">
          <ShabbosBanner />
          {children}
        </main>

        {/* Mobile Bottom Tab Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card flex items-center justify-around p-2 z-40">
          {NAV_ITEMS.slice(0, 6).map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex flex-col items-center justify-center p-1.5 rounded-lg cursor-pointer ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-[9px] mt-0.5 font-medium leading-tight text-center">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
