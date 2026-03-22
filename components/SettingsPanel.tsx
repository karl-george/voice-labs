import { Settings } from 'lucide-react';

const SettingsPanel = () => {
  return (
    <div className="hidden w-105 min-h-0 flex-col lg:flex border-l">
      <div className="flex items-center gap-2 border-b px-4 h-12">
        <Settings className="size-4" />
        <span className="text-sm font-medium">Settings</span>
      </div>
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-sm text-muted-foreground">Voice settings will appear here</p>
      </div>
    </div>
  );
};
export default SettingsPanel;
