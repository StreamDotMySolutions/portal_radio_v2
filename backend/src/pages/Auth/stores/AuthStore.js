import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const base_url = process.env.REACT_APP_BACKEND_URL;

const useAuthStore = create(persist(
    (set) => ({
        isAuthenticated: false,
        user: null,
        user_departments_url: `${base_url}/user-departments/?page=1`,
        store_url: `${base_url}/register`,
        refresh: false,
        errors: null,
        login: (user) => set({ isAuthenticated: true, user }),
        logout: () => set({ isAuthenticated: false, user: null }),
        setErrors: (errors) => set({ errors }),
    }),
    {
        name: 'auth-storage',
        storage: createJSONStorage(() => localStorage),
    }
));

export default useAuthStore;
