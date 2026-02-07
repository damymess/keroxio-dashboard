import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Menu,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { cn } from '../../lib/utils';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { setSidebarOpen } = useUIStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/clients?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowMobileSearch(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 glass-header">
      <div className="flex h-full items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
        {/* Mobile: Menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl hover:bg-white/5 transition-colors lg:hidden flex-shrink-0 text-white/60"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search - Desktop */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="text"
              placeholder="Rechercher clients, prospects, véhicules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-2xl glass-input text-sm text-foreground placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-ios-blue/50"
            />
          </div>
        </form>

        {/* Mobile: Search toggle */}
        <button
          onClick={() => setShowMobileSearch(!showMobileSearch)}
          className="p-2 rounded-xl hover:bg-white/5 transition-colors sm:hidden text-white/60"
          aria-label="Rechercher"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Spacer on mobile */}
        <div className="flex-1 sm:hidden" />

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors text-white/60">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-ios-red shadow-[0_0_6px_rgba(255,59,48,0.5)]" />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-ios-blue to-ios-purple flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium hidden lg:block text-white/80">
                {user?.username || 'Utilisateur'}
              </span>
              <ChevronDown className="h-4 w-4 hidden lg:block text-white/40" />
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-2xl py-1 z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium truncate text-white">{user?.username}</p>
                  <p className="text-xs text-white/40 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-ios-red hover:bg-white/5 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search overlay */}
      {showMobileSearch && (
        <div className="absolute left-0 right-0 top-full glass-header p-3 sm:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full h-10 pl-10 pr-4 rounded-2xl glass-input text-sm text-foreground placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-ios-blue/50"
              />
            </div>
          </form>
        </div>
      )}

      {/* Click outside to close */}
      {(showUserMenu || showMobileSearch) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => {
            setShowUserMenu(false);
            setShowMobileSearch(false);
          }}
        />
      )}
    </header>
  );
}
