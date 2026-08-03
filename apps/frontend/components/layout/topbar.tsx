'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Bell,
  HelpCircle,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from 'lucide-react';

import {
  Avatar,
  Button,
  Drawer,
  Dropdown,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  Input,
} from '@repo/shared-ui';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { useAuthStore } from '@/stores/auth-store';

function initialsFor(name: string | null, email: string): string {
  if (name) {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function Topbar() {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  async function handleLogout() {
    await logout();
    router.push('/login');
  }

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email
    : 'Not signed in';

  return (
    <header className="bg-background flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <Drawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        position="left"
        size="250px"
        title="Agentic CMS"
        className="p-0"
      >
        <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
      </Drawer>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>

      <span className="hidden font-semibold md:inline">Agentic CMS</span>

      <div className="ml-2 hidden max-w-sm flex-1 md:block">
        <Input placeholder="Search" icon={Search} className="w-full" />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Help">
          <HelpCircle className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>

        <Dropdown
          trigger={
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 whitespace-nowrap h-10"
            >
              <Avatar
                className="size-7 shrink-0"
                letters={initialsFor(
                  user?.firstName ?? null,
                  user?.email ?? '??',
                )}
              />
              <span className="hidden text-sm font-medium lg:block">
                {displayName}
              </span>
            </Button>
          }
          align="end"
          className="w-48"
        >
          <DropdownLabel>{displayName}</DropdownLabel>
          <DropdownSeparator />
          <DropdownItem>
            <User className="mr-2 size-4" />
            Profile
          </DropdownItem>
          <DropdownItem>
            <Settings className="mr-2 size-4" />
            Settings
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem
            className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950"
            onClick={() => void handleLogout()}
          >
            <LogOut className="mr-2 size-4" />
            Sign out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
