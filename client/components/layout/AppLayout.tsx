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

      <footer className="border-t pb-14 md:pb-0">
        <div className="container py-6 text-sm text-muted-foreground hidden md:flex items-center justify-between">
          <p>© {new Date().getFullYear()} SoilSense</p>
          <p className="hidden sm:block">Healthy soil, better yields.</p>
        </div>
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background">
          <div className="mx-auto max-w-xl grid grid-cols-5 h-14">
            <Tab to="/" label="Dashboard" icon="dashboard" />
            <Tab to="/farms" label="Farms" icon="farm" />
            <Tab to="/fields" label="Fields" icon="fields" />
            <Tab to="/reports" label="Reports" icon="reports" />
            <Tab to="/settings" label="Settings" icon="settings" />
          </div>
        </nav>
      </footer>
    </div>
  );
}

function Tab({ to, label, icon }: { to: string; label: string; icon: "dashboard"|"farm"|"fields"|"reports"|"settings" }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center text-xs ${isActive ? "text-primary" : "text-muted-foreground"}`
      }
      end
    >
      <span className="h-5 w-5 mb-0.5">
        {icon === "dashboard" && <span className="inline-block h-5 w-5 rounded-full border border-primary bg-primary/10" />}
        {icon === "farm" && <span className="inline-block h-5 w-5 rounded-sm border" />}
        {icon === "fields" && <span className="inline-block h-5 w-5 border rounded" />}
        {icon === "reports" && <span className="inline-block h-5 w-5 border rounded-sm" />}
        {icon === "settings" && <span className="inline-block h-5 w-5 border rounded-full" />}
      </span>
      {label}
    </NavLink>
  );
}
