import { create } from "zustand";
import Cookies from "js-cookie";

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  // We provide both user and patient terminology to satisfy the requirements
  user: UserProfile | null;
  patient: UserProfile | null; 
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  setPatient: (patient: UserProfile | null) => void;
  setToken: (token: string | null) => void;
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => {
  // Initialize token from Cookies if it exists
  const initialToken = typeof window !== "undefined" ? Cookies.get("token") || null : null;
  
  // Initialize user from localStorage if it exists
  let initialUser: UserProfile | null = null;
  if (typeof window !== "undefined") {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        initialUser = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error("Failed to parse stored user", e);
    }
  }

  return {
    user: initialUser,
    patient: initialUser, // patient points to same object
    token: initialToken,
    isAuthenticated: !!initialToken && !!initialUser,

    setUser: (user) => {
      set({ user, patient: user, isAuthenticated: !!user });
      if (typeof window !== "undefined") {
        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          localStorage.removeItem("user");
        }
      }
    },

    setPatient: (patient) => {
      set({ user: patient, patient, isAuthenticated: !!patient });
      if (typeof window !== "undefined") {
        if (patient) {
          localStorage.setItem("user", JSON.stringify(patient));
        } else {
          localStorage.removeItem("user");
        }
      }
    },

    setToken: (token) => {
      set({ token });
      if (typeof window !== "undefined") {
        if (token) {
          Cookies.set("token", token, { expires: 7, secure: true, sameSite: "strict" });
        } else {
          Cookies.remove("token");
        }
      }
    },

    login: (user, token) => {
      set({ user, patient: user, token, isAuthenticated: true });
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
        Cookies.set("token", token, { expires: 7, secure: true, sameSite: "strict" });
      }
    },

    logout: () => {
      set({ user: null, patient: null, token: null, isAuthenticated: false });
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        Cookies.remove("token");
      }
    },
  };
});

// Alias usePatientStore to useUserStore for convenience if requested
export const usePatientStore = useUserStore;
