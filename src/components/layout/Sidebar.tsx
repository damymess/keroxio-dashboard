import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Car,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Mes Véhicules', href: '/vehicles', icon: Car },
];

const bottomNavigation: NavItem[] = [
  { name: 'FAQ', href: '/faq', icon: HelpCircle },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();

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
          'flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200',
          isActive
            ? 'glass-btn-primary text-white'
            : 'text-white/50 hover:text-white/80 hover:bg-white/5',
          sidebarCollapsed && !sidebarOpen && 'lg:justify-center lg:px-2'
        )}
        title={sidebarCollapsed && !sidebarOpen ? item.name : undefined}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {(!sidebarCollapsed || sidebarOpen) && (
          <span className="text-sm font-medium">{item.name}</span>
        )}
      </Link>
    </li>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen glass-sidebar transition-all duration-300',
          'lg:translate-x-0',
          sidebarCollapsed ? 'lg:w-16' : 'lg:w-64',
          'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/8">
          {(!sidebarCollapsed || sidebarOpen) && (
            <Link to="/" className="flex items-center gap-2.5" onClick={handleLinkClick}>
              <div className="h-8 w-8 rounded-xl bg-ios-blue flex items-center justify-center shadow-[0_2px_12px_rgba(0,122,255,0.3)]">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-semibold text-lg text-white">Keroxio</span>
            </Link>
          )}

          <button
            onClick={toggleSidebar}
            className={cn(
              'p-1.5 rounded-xl hover:bg-white/5 transition-colors hidden lg:block text-white/40 hover:text-white/70',
              sidebarCollapsed && 'mx-auto'
            )}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-xl hover:bg-white/5 transition-colors lg:hidden text-white/40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col h-[calc(100vh-4rem)] justify-between p-3 overflow-y-auto">
          <div className="space-y-4">
            {/* New Vehicle CTA */}
            {(!sidebarCollapsed || sidebarOpen) && (
              <Link
                to="/new"
                onClick={handleLinkClick}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl glass-btn-primary text-white font-medium"
              >
                <Plus className="h-5 w-5" />
                Nouveau véhicule
              </Link>
            )}
            {sidebarCollapsed && !sidebarOpen && (
              <Link
                to="/new"
                onClick={handleLinkClick}
                className="flex items-center justify-center p-3 rounded-2xl glass-btn-primary text-white"
                title="Nouveau véhicule"
              >
                <Plus className="h-5 w-5" />
              </Link>
            )}

            {/* Main Navigation */}
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href ||
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                return renderNavItem(item, isActive);
              })}
            </ul>
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
