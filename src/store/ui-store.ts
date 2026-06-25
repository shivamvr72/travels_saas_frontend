import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  isCommandPaletteOpen: boolean;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  isCommandPaletteOpen: false,
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setCommandPaletteOpen: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
}));
