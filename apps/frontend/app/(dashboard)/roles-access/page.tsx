'use client';

import { useState } from 'react';
import { Tabs } from '@repo/shared-ui';
import { RolesTab } from '@/components/roles-access/roles-tab';
import { UsersTab } from '@/components/roles-access/users-tab';
import { TokensTab } from '@/components/roles-access/tokens-tab';
import { useAuthStore } from '@/stores/auth-store';

export default function RolesAccessPage() {
  const [activeTab, setActiveTab] = useState(0);
  const user = useAuthStore((state) => state.user);
  const isAdmin =
    user?.roles.some((role) => role.toLowerCase() === 'admin') || false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Roles & Access</h1>
        <p className="text-muted-foreground">
          Manage roles, user access, and API tokens.
        </p>
      </div>

      <Tabs
        options={isAdmin ? ['Roles', 'Users', 'API Tokens'] : ['Users']}
        selected={activeTab}
        value={setActiveTab}
      />

      <div className="mt-4">
        {isAdmin ? (
          <>
            {activeTab === 0 && (
              <div className="space-y-4 h-[calc(100vh-14rem)]">
                <RolesTab />
              </div>
            )}
            {activeTab === 1 && (
              <div className="space-y-4">
                <UsersTab isAdmin={isAdmin} />
              </div>
            )}
            {activeTab === 2 && (
              <div className="space-y-4">
                <TokensTab />
              </div>
            )}
          </>
        ) : (
          <>
            {activeTab === 0 && (
              <div className="space-y-4">
                <UsersTab isAdmin={isAdmin} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
