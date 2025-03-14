import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,

  initializeAuth: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        set({ isAuthenticated: true, user: JSON.parse(userData) }, false);
        return true; // Ensures we return true only when update is done
      }
    }
    return false;
  },

  login: (token, user) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    set({ isAuthenticated: false, user: null });
  },

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
}));

export default useAuthStore;
