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
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Prospects', href: '/prospects', icon: UserPlus },
  { name: 'Pipeline', href: '/pipeline', icon: Kanban },
  { name: 'Véhicules', href: '/vehicles', icon: Car },
  { name: 'Photos', href: '/photos', icon: Image },
  { name: 'Annonces', href: '/annonces', icon: FileText },
  { name: 'Factures', href: '/factures', icon: Receipt },
  { name: 'Statistiques', href: '/statistics', icon: BarChart3 },
  { name: 'Tâches', href: '/tasks', icon: CheckSquare },
];

const bottomNavigation = [
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();

  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

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
          // Desktop: always visible, width based on collapsed state
          'lg:translate-x-0',
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-64',
          // Mobile: slide in/out, always full width when open
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
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href));

              return (
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
            })}
          </ul>

          <ul className="space-y-1">
            {bottomNavigation.map((item) => {
              const isActive = location.pathname === item.href;

              return (
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
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
