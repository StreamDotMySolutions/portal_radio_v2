// import { create } from 'zustand'

// const base_url = process.env.REACT_APP_BACKEND_URL

// const auth = {
   
//     isAuthenticated: false,
//     user_departments_url:  `${base_url}/user-departments/?page=1`,
//     store_url :  `${base_url}/register`,
//     refresh: false,
//     errors : null,
// }
// const useAuthStore = create( () => (auth) ) // create store
// export default useAuthStore


import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const base_url = process.env.REACT_APP_BACKEND_URL;

const useAuthStore = create(persist(
  (set) => ({
    isAuthenticated: false,
    user_departments_url: `${base_url}/user-departments/?page=1`,
    store_url: `${base_url}/register`,
    refresh: false,
    errors: null,
    login: () => set({ isAuthenticated: true }),
    logout: () => set({ isAuthenticated: false }),
    setErrors: (errors) => set({ errors }),
  }),
  {
    name: 'auth-storage', // unique name for localStorage key
    getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
  }
));

export default useAuthStore;