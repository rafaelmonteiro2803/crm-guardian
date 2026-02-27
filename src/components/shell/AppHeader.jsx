import React from "react";
import { Icons } from "../Icons";

const renderNavItem = (item, viewMode, setViewMode, setOpenDropdown) => (
  <button
    key={item.key}
    onClick={() => { setViewMode(item.key); setOpenDropdown(null); }}
    className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors ${viewMode === item.key ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
  >
    {item.icon}<span className="flex-1">{item.label}</span>
    {item.count !== undefined && <span className="text-gray-400 text-[10px] tabular-nums">{item.count}</span>}
  </button>
);

const renderNavItemIndented = (item, viewMode, setViewMode, setOpenDropdown) => (
  <button
    key={item.key}
    onClick={() => { setViewMode(item.key); setOpenDropdown(null); }}
    className={`w-full flex items-center gap-2 px-5 py-2 text-xs text-left transition-colors ${viewMode === item.key ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
  >
    {item.icon}<span className="flex-1">{item.label}</span>
    {item.count !== undefined && <span className="text-gray-400 text-[10px] tabular-nums">{item.count}</span>}
  </button>
);

const renderMobileNavItem = (item, viewMode, setViewMode, setMobileMenuOpen, indent = false) => (
  <button
    key={item.key}
    onClick={() => { setViewMode(item.key); setMobileMenuOpen(false); }}
    className={`w-full flex items-center gap-2 ${indent ? "px-7" : "px-5"} py-2 text-xs rounded transition-colors ${viewMode === item.key ? "bg-gray-800 text-white" : "text-gray-600 hover:bg-black/5"}`}
  >
    {item.icon}<span className="flex-1">{item.label}</span>
    {item.count !== undefined && <span className="text-[10px] tabular-nums opacity-60">{item.count}</span>}
  </button>
);

export function AppHeader({
  tenantCor,
  tenantNome,
  tenantSlogan,
  session,
  navGroups,
  viewMode,
  setViewMode,
  openDropdown,
  setOpenDropdown,
  mobileMenuOpen,
  setMobileMenuOpen,
  isMobile,
  onSignOut,
  onEditProfile,
}) {
  return (
    <header
      style={tenantCor ? { backgroundColor: tenantCor } : {}}
      className={`${tenantCor ? "" : "bg-white"} border-b border-gray-200 px-4 py-2`}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <h1 className="text-sm font-semibold text-gray-800 tracking-wide whitespace-nowrap flex-shrink-0">
          {tenantNome || "CRM GuardIAn"}
        </h1>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {navGroups.map((group) => {
            const allItems = group.subgroups ? group.subgroups.flatMap((sg) => sg.items) : (group.items || []);
            const isActive = allItems.some((i) => i.key === viewMode);
            const isOpen = openDropdown === group.key;
            return (
              <div key={group.key} className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenDropdown(isOpen ? null : group.key); }}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${isActive ? "bg-gray-800 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-black/5"}`}
                >
                  {group.icon}<span>{group.label}</span>
                  <Icons.ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden">
                    {group.subgroups ? (
                      group.subgroups.map((subgroup, sgIdx) => (
                        <div key={subgroup.key}>
                          {sgIdx > 0 && <div className="border-t border-gray-100 my-1" />}
                          <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                            {subgroup.icon}<span>{subgroup.label}</span>
                          </div>
                          {subgroup.items.map((item) => renderNavItemIndented(item, viewMode, setViewMode, setOpenDropdown))}
                        </div>
                      ))
                    ) : (
                      group.items.map((item) => renderNavItem(item, viewMode, setViewMode, setOpenDropdown))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Desktop: user menu */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0 ml-auto">
          {tenantSlogan && <span className="text-xs text-gray-500 italic">{tenantSlogan}</span>}
          {tenantSlogan && <span className="text-gray-300">|</span>}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === "user" ? null : "user"); }}
              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-black/5"
            >
              <Icons.User />{session.user.user_metadata?.nome || session.user.email}
              <Icons.ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openDropdown === "user" ? "rotate-180" : ""}`} />
            </button>
            {openDropdown === "user" && (
              <div className="absolute top-full right-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 overflow-hidden">
                <button
                  onClick={onEditProfile}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-left"
                >
                  <Icons.Edit />Editar Dados
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={onSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 text-left"
                >
                  <Icons.LogOut />Sair do Sistema
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: logout + hamburger */}
        <div className="md:hidden ml-auto flex items-center gap-1">
          {isMobile ? (
            <>
              {tenantSlogan && <span className="text-xs text-gray-500 italic mr-1">{tenantSlogan}</span>}
              <button onClick={onSignOut} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-black/5"><Icons.LogOut />Sair</button>
            </>
          ) : (
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center p-1.5 rounded text-gray-600 hover:text-gray-900 hover:bg-black/5">
              {mobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu panel */}
      {!isMobile && mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 mt-2 py-2 max-w-7xl mx-auto">
          {navGroups.map((group) => (
            <div key={group.key} className="mt-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                {group.icon}{group.label}
              </div>
              {group.subgroups ? (
                group.subgroups.map((subgroup, sgIdx) => (
                  <div key={subgroup.key}>
                    {sgIdx > 0 && <div className="border-t border-gray-100 mx-3 my-1" />}
                    <div className="px-5 py-1 text-[10px] font-medium text-gray-400 flex items-center gap-1.5">{subgroup.icon}<span>{subgroup.label}</span></div>
                    {subgroup.items.map((item) => renderMobileNavItem(item, viewMode, setViewMode, setMobileMenuOpen, true))}
                  </div>
                ))
              ) : (
                group.items.map((item) => renderMobileNavItem(item, viewMode, setViewMode, setMobileMenuOpen))
              )}
            </div>
          ))}
          <div className="border-t border-gray-100 mt-2 pt-2 px-3 space-y-2">
            <div className="text-xs font-medium text-gray-600">{tenantNome}</div>
            <div className="text-[11px] text-gray-700 font-medium">{session.user.user_metadata?.nome || session.user.email}</div>
            <div className="flex flex-col gap-0.5">
              <button
                onClick={onEditProfile}
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 py-1 text-left"
              >
                <Icons.Edit />Editar Dados
              </button>
              <button
                onClick={onSignOut}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 py-1 text-left"
              >
                <Icons.LogOut />Sair do Sistema
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
