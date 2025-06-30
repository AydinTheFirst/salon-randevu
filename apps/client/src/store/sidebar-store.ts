import { create } from "zustand";

export interface SidebarStore {
  closeSidebar: () => void;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarStore>((set) => ({
  closeSidebar: () => set({ isSidebarOpen: false }),
  isSidebarOpen: true,
  openSidebar: () => set({ isSidebarOpen: true }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen }))
}));
