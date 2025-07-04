import { create } from "zustand";

import type { User } from "~/types";

interface AuthStore {
  isAuthenticated: boolean;
  setUser: (user: null | User) => void;
  user: null | User;
}
