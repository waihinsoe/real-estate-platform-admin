"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="h-9 w-9 grid place-items-center rounded-lg border border-border hover:bg-accent transition-colors duration-300 overflow-hidden"
    >
      {mounted && (
        <div>
          {resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </div>
      )}
    </button>
  );
}
