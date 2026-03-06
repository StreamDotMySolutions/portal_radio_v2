import { create } from 'zustand';

export const useComplaintStore = create((set) => ({
    refreshKey: 0,
    paginatorUrl: '/api/complaints',
    search: '',
    categoryFilter: '',
    platformFilter: '',

    setRefreshKey: (key) => set({ refreshKey: key }),
    setPaginatorUrl: (url) => set({ paginatorUrl: url }),
    setSearch: (search) => set({ search }),
    setCategoryFilter: (filter) => set({ categoryFilter: filter }),
    setPlatformFilter: (filter) => set({ platformFilter: filter }),
}));
