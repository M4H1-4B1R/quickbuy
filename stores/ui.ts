import { create } from "zustand";

interface UiState {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export const useUi = create<UiState>((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}));
