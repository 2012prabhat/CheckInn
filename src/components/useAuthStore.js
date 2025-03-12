import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  
  initializeAuth: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) set({ isAuthenticated: true });
    }
  },

  login: (token) => {
    localStorage.setItem("accessToken", token);
    set({ isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ isAuthenticated: false, user: null });
  },

  setUser: (user) => {
    set({ user });
  },
}));

export default useAuthStore;
