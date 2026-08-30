import React from 'react';
import {
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Settings,
  LogOut,
  X,
  Wallet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'income', label: 'Income', icon: ArrowUpRight, countColor: 'text-emerald-400' },
    { id: 'expenses', label: 'Expenses', icon: ArrowDownRight, countColor: 'text-rose-400' },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#0d0d0f] border-r border-[#222224] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Zone */}
        <div>
          <div className="flex items-center justify-between h-16 px-6 border-b border-[#222224]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="font-extrabold tracking-tight text-white text-base">
                Vault<span className="text-emerald-400">Flow</span>
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#222224] bg-[#0a0a0b]/50">
          <div className="flex items-center justify-between gap-3 mb-3 p-2 rounded-xl bg-[#151517] border border-[#2d2d30]">
            <div className="min-w-0 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#222224] text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-zinc-400 truncate">{user?.email || 'user@vaultflow.io'}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
