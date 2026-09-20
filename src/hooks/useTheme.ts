import { useUIStore } from '../store/useUIStore';

export function useTheme() {
  const { theme, toggleTheme, setTheme } = useUIStore();
  return { theme, isDark: theme === 'dark', toggleTheme, setTheme };
}
