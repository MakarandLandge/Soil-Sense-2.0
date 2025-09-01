import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, FileSpreadsheet, Settings as SettingsIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-foreground/70 hover:text-foreground hover:bg-secondary"
        }`
      }
      end
    >
      {children}
    </NavLink>
  );
}

function LangSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <select
      aria-label="Language"
      className="h-9 px-2 rounded-md border bg-background text-sm"
      value={lang}
      onChange={(e) => setLang(e.target.value as any)}
    >
      <option value="en">EN</option>
      <option value="hi">हिं</option>
      <option value="mr">मरा</option>
    </select>
  );
}

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">SoilSense</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/reports">Reports</NavItem>
            <NavItem to="/settings">Settings</NavItem>
          </nav>

          <div className="flex items-center gap-2">
            <LangSwitcher />
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <a
                href="https://www.google.com/search?q=soil+pH+management+guide"
                target="_blank"
                rel="noreferrer"
              >
                Google Info
              </a>
            </Button>
            <Button asChild className="md:hidden" variant="secondary">
              <Link to="/reports">
                <FileSpreadsheet className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild className="md:hidden" variant="secondary">
              <Link to="/settings">
                <SettingsIcon className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="container py-6 text-sm text-muted-foreground flex items-center justify-between">
          <p>© {new Date().getFullYear()} SoilSense</p>
          <p className="hidden sm:block">Healthy soil, better yields.</p>
        </div>
      </footer>
    </div>
  );
}
