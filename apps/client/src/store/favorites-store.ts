import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  addToFavorites: (businessId: string) => void;
  clearFavorites: () => void;
  favorites: string[];
  isFavorite: (businessId: string) => boolean;
  removeFromFavorites: (businessId: string) => void;
  toggleFavorite: (businessId: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      addToFavorites: (businessId: string) =>
        set((state) => ({
          favorites: state.favorites.includes(businessId)
            ? state.favorites
            : [...state.favorites, businessId]
        })),

      clearFavorites: () => set({ favorites: [] }),

      favorites: [],

      isFavorite: (businessId: string) => get().favorites.includes(businessId),

      removeFromFavorites: (businessId: string) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== businessId)
        })),

      toggleFavorite: (businessId: string) =>
        set((state) => ({
          favorites: state.favorites.includes(businessId)
            ? state.favorites.filter((id) => id !== businessId)
            : [...state.favorites, businessId]
        }))
    }),
    {
      name: "favorites-storage", // localStorage key
      version: 1
    }
  )
);
