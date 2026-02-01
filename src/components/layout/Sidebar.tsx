import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Kanban,
  Car,
  Image,
  FileText,
  Receipt,
  BarChart3,
  CheckSquare,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  Crown,
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresBusiness?: boolean;
}

// Core navigation - visible to all users
const coreNavigation: NavItem[] = [
  { name: 'Accueil', href: '/', icon: LayoutDashboard },
  { name: 'Traitement Photos', href: '/photos', icon: Image },
  { name: 'Mes Véhicules', href: '/vehicles', icon: Car },
];

// Business+ only navigation (CRM)
const businessNavigation: NavItem[] = [
  { name: 'Clients', href: '/clients', icon: Users, requiresBusiness: true },
  { name: 'Prospects', href: '/prospects', icon: UserPlus, requiresBusiness: true },
  { name: 'Pipeline', href: '/pipeline', icon: Kanban, requiresBusiness: true },
  { name: 'Annonces', href: '/annonces', icon: FileText, requiresBusiness: true },
  { name: 'Factures', href: '/factures', icon: Receipt, requiresBusiness: true },
  { name: 'Statistiques', href: '/statistics', icon: BarChart3, requiresBusiness: true },
  { name: 'Tâches', href: '/tasks', icon: CheckSquare, requiresBusiness: true },
];

const bottomNavigation: NavItem[] = [
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const { user } = useAuthStore();
  
  const hasCRM = user?.plan === 'pro_business';

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const renderNavItem = (item: NavItem, isActive: boolean) => (
    <li key={item.name}>
      <Link
        to={item.href}
        onClick={handleLinkClick}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          sidebarCollapsed && !sidebarOpen && 'lg:justify-center lg:px-2'
        )}
        title={sidebarCollapsed && !sidebarOpen ? item.name : undefined}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {(!sidebarCollapsed || sidebarOpen) && (
          <span className="text-sm font-medium">{item.name}</span>
        )}
        {sidebarCollapsed && !sidebarOpen && (
          <span className="text-sm font-medium lg:hidden">{item.name}</span>
        )}
      </Link>
    </li>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-all duration-300',
          'lg:translate-x-0',
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-64',
          'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          {(!sidebarCollapsed || sidebarOpen) && (
            <Link to="/" className="flex items-center gap-2" onClick={handleLinkClick}>
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-semibold text-lg">Keroxio</span>
            </Link>
          )}

          {/* Desktop: collapse button */}
          <button
            onClick={toggleSidebar}
            className={cn(
              'p-1.5 rounded-lg hover:bg-accent transition-colors hidden lg:block',
              sidebarCollapsed && 'mx-auto'
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>

          {/* Mobile: close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col h-[calc(100vh-4rem)] justify-between p-3 overflow-y-auto">
          <div className="space-y-6">
            {/* Core Navigation */}
            <ul className="space-y-1">
              {coreNavigation.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                return renderNavItem(item, isActive);
              })}
            </ul>

            {/* Business+ CRM Section */}
            {hasCRM ? (
              <div>
                {(!sidebarCollapsed || sidebarOpen) && (
                  <div className="flex items-center gap-2 px-3 mb-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      CRM Pro Business
                    </span>
                  </div>
                )}
                <ul className="space-y-1">
                  {businessNavigation.map((item) => {
                    const isActive = location.pathname === item.href ||
                      (item.href !== '/' && location.pathname.startsWith(item.href));
                    return renderNavItem(item, isActive);
                  })}
                </ul>
              </div>
            ) : (
              /* Upgrade CTA for non-business users */
              (!sidebarCollapsed || sidebarOpen) && (
                <div className="mx-2 p-3 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-semibold">Pro Business</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Débloquez le CRM complet : clients, prospects, factures...
                  </p>
                  <Link
                    to="/settings?tab=subscription"
                    onClick={handleLinkClick}
                    className="block w-full text-center text-xs font-medium py-2 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    Passer à Pro Business
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Bottom Navigation */}
          <ul className="space-y-1">
            {bottomNavigation.map((item) => {
              const isActive = location.pathname === item.href;
              return renderNavItem(item, isActive);
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
