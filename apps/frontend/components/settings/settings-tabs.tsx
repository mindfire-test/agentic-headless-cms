'use client';

import { useState } from 'react';
import { Tabs } from '@repo/shared-ui';
import { GeneralSettingsTab } from './general-settings-tab';
import { LocalesTab } from './locales-tab';

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-4">
      <Tabs
        options={['General', 'Locales']}
        selected={activeTab}
        value={setActiveTab}
      />
      <div className="mt-4">
        {activeTab === 0 && <GeneralSettingsTab />}
        {activeTab === 1 && <LocalesTab />}
      </div>
    </div>
  );
}
