'use client';

import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup
      type="single"
      className="flex border w-[165px] border-solid border-border-primary p-1 rounded-lg gap-2 items-center justify-center"
      value={theme}
    >
      <ToggleGroupItem
        value="light"
        className="flex rounded-lg px-1 py-2 justify-center items-center gap-2"
        onClick={() => setTheme('light')}
      >
        <SunIcon className="flex h-4 w-16" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        className="flex rounded-lg px-1 py-2 justify-center items-center gap-2"
        onClick={() => setTheme('dark')}
      >
        <MoonIcon className="flex h-4 w-16" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
