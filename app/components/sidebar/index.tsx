"use client";

import { useState, type ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/lib/auth-actions";
import {
  OverviewIcon,
  TransactionsIcon,
  BudgetsIcon,
  PotsIcon,
  RecurringBillsIcon,
  MinimizeMenuIcon,
  SettingsIcon,
} from "./icons";

interface MenuItem {
  name: string;
  path: "/" | "/transactions" | "/budgets" | "/pots" | "/bills" | "/accounts" | "/settings";
  icon: ComponentType<{ className?: string }>;
}

type SidebarProps = {
  user: {
    name: string;
    email: string;
  };
};

function ProfileIcon() {
  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-grey-300 text-grey-300">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="m6.25 7.25 2.75 2.75 2.75-2.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m6.25 10.75 2.75-2.75 2.75 2.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function UserIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden="true">
      <circle cx="12.5" cy="7.25" r="3.25" stroke="currentColor" strokeWidth="2" />
      <path d="M5.75 20.25c.33-3.1 2.8-5.25 6.75-5.25s6.42 2.15 6.75 5.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" aria-hidden="true">
      <path d="M10 5H6.75c-.83 0-1.5.67-1.5 1.5v12c0 .83.67 1.5 1.5 1.5H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M13.5 8.5 17.25 12.25 13.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 12.25H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const Sidebar = ({ user }: SidebarProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { name: "Overview", path: "/", icon: OverviewIcon },
    { name: "Transactions", path: "/transactions", icon: TransactionsIcon },
    { name: "Budgets", path: "/budgets", icon: BudgetsIcon },
    { name: "Pots", path: "/pots", icon: PotsIcon },
    { name: "Recurring bills", path: "/bills", icon: RecurringBillsIcon },
    { name: "Accounts", path: "/accounts", icon: OverviewIcon },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <aside
      className={`z-100 flex h-screen w-full flex-col overflow-visible bg-grey-900 transition-all duration-300 ease-in-out lg:relative lg:h-full ${isMinimized ? "lg:w-2200" : "lg:w-75"} max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:h-auto max-lg:flex-row`}
    >
      <div className="p-500 px-400 max-lg:hidden">
        <h1 className="text-2xl font-bold text-white">{isMinimized ? "F" : "Finace"}</h1>
      </div>

      <nav className="flex flex-1 flex-row gap-50 lg:flex-col lg:pr-200 max-lg:w-full max-lg:justify-around">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`group flex items-center text-grey-500 transition-all duration-300 hover:text-white max-lg:flex-1 max-lg:flex-col max-lg:items-center max-lg:justify-center max-lg:border-t-4 max-lg:border-transparent max-lg:pb-100 max-lg:pt-150 lg:rounded-r-xl lg:border-l-4 lg:border-transparent lg:py-200 ${isMinimized ? "lg:justify-center lg:px-0" : "lg:px-400"} ${isActive(item.path) ? "border-secondary-green bg-beige-100 text-grey-900" : ""}`}
          >
            <item.icon className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:scale-110" />
            <span className={`whitespace-nowrap font-medium transition-all duration-300 max-lg:mt-100 max-lg:text-xs max-sm:hidden ${isMinimized ? "lg:hidden" : "lg:ml-250 lg:block"}`}>
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      <button
        className="hidden items-center p-400 text-grey-500 transition-colors hover:text-white lg:flex"
        onClick={() => setIsMinimized((minimized) => !minimized)}
        aria-label={isMinimized ? "Expand menu" : "Minimize menu"}
      >
        <MinimizeMenuIcon className={`h-5 w-5 transition-transform duration-300 ${isMinimized ? "rotate-180" : ""}`} />
        {!isMinimized && <span className="ml-250 whitespace-nowrap">Minimize Menu</span>}
      </button>

      <div className="relative mx-300 mb-300 hidden lg:block">
        {isProfileOpen && (
          <div className={`absolute bottom-[calc(100%+0.75rem)] z-20 rounded-2xl bg-white p-200 shadow-2xl ${isMinimized ? "left-0 w-64" : "inset-x-0"}`}>
            <Link
              href="/settings"
              onClick={() => setIsProfileOpen(false)}
              className="flex items-center gap-300 rounded-xl px-300 py-400 text-lg font-medium text-grey-900 hover:bg-beige-100"
            >
              <UserIcon />
              Manage Profile
            </Link>
            <div className="my-100 h-px bg-beige-100" />
            <form action={logout}>
              <button type="submit" className="flex w-full items-center gap-300 rounded-xl bg-[#c9474f] px-300 py-400 text-left text-lg font-medium text-white hover:bg-[#b63d45]">
                <LogoutIcon />
                Logout
              </button>
            </form>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsProfileOpen((open) => !open)}
          aria-expanded={isProfileOpen}
          className={`flex w-full items-center gap-300 rounded-2xl border border-grey-500 p-300 text-left transition-colors hover:bg-white/5 ${isMinimized ? "justify-center" : ""}`}
        >
          <ProfileIcon />
          {!isMinimized && (
            <span className="min-w-0">
              <span className="block truncate text-lg font-bold text-white">{user.name}</span>
              <span className="block max-w-[12rem] truncate text-sm font-bold text-white">{user.email}</span>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
