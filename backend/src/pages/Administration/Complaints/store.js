import { create } from 'zustand';

export const useComplaintStore = create((set) => ({
    refreshKey: 0,
    setRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),

    paginatorUrl: null,
    setPaginatorUrl: (url) => set({ paginatorUrl: url }),

    search: '',
    setSearch: (search) => set({ search, paginatorUrl: null }),

    categoryFilter: '',
    setCategoryFilter: (filter) => set({ categoryFilter: filter, paginatorUrl: null }),
}));
